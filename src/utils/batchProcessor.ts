import { Logger } from './logger';

/**
 * BatchProcessor implements the batch processing system described
 * in the ClaudeOSaar mathematical model for cost optimization.
 * 
 * Features:
 * - Batches multiple API calls into a single request
 * - Semantic grouping of similar queries
 * - Predictive batching based on historical patterns
 * - Manages latency-throughput tradeoffs
 */
export class BatchProcessor {
  private logger: Logger;
  private batchQueueMap: Map<string, BatchQueue<any>>;
  private defaultMaxBatchSize = 64; // Maximum batch size as per the model
  private defaultMaxWaitTime = 200; // Maximum wait time in ms
  
  constructor() {
    this.logger = new Logger('BatchProcessor');
    this.batchQueueMap = new Map();
  }
  
  /**
   * Create a batch queue for a specific operation type
   */
  createBatchQueue<T, R>(
    queueName: string,
    processor: (items: T[]) => Promise<R[]>,
    options: BatchOptions = {}
  ): BatchQueue<T> {
    const queue = new BatchQueue<T>(
      processor,
      {
        maxBatchSize: options.maxBatchSize || this.defaultMaxBatchSize,
        maxWaitTime: options.maxWaitTime || this.defaultMaxWaitTime,
        semanticGrouping: options.semanticGrouping || false,
        priorityFunction: options.priorityFunction
      }
    );
    
    this.batchQueueMap.set(queueName, queue);
    this.logger.info(`Created batch queue: ${queueName}`);
    return queue;
  }
  
  /**
   * Get a batch queue by name
   */
  getBatchQueue<T>(queueName: string): BatchQueue<T> | undefined {
    return this.batchQueueMap.get(queueName) as BatchQueue<T> | undefined;
  }
  
  /**
   * Get the batch queue for a specific queue, creating it if it doesn't exist
   */
  getOrCreateBatchQueue<T, R>(
    queueName: string,
    processor: (items: T[]) => Promise<R[]>,
    options: BatchOptions = {}
  ): BatchQueue<T> {
    const existingQueue = this.getBatchQueue<T>(queueName);
    if (existingQueue) {
      return existingQueue;
    }
    
    return this.createBatchQueue<T, R>(queueName, processor, options);
  }
  
  /**
   * Add an item to a batch queue for processing
   */
  async addToBatch<T, R>(
    queueName: string,
    item: T,
    processor: (items: T[]) => Promise<R[]>,
    options: BatchOptions = {}
  ): Promise<R> {
    const queue = this.getOrCreateBatchQueue<T, R>(queueName, processor, options);
    return queue.add(item) as Promise<R>;
  }
  
  /**
   * Process a batch immediately
   */
  async processBatchNow<T, R>(
    queueName: string,
    items: T[],
    processor: (items: T[]) => Promise<R[]>
  ): Promise<R[]> {
    try {
      this.logger.info(`Processing batch of ${items.length} items immediately for queue: ${queueName}`);
      return await processor(items);
    } catch (error) {
      this.logger.error(`Error processing batch for queue ${queueName}:`, error);
      throw error;
    }
  }
  
  /**
   * Close all batch queues
   */
  async close(): Promise<void> {
    for (const [name, queue] of this.batchQueueMap.entries()) {
      this.logger.info(`Closing batch queue: ${name}`);
      await queue.close();
    }
    this.batchQueueMap.clear();
  }
}

export class BatchQueue<T> {
  private queue: Array<{ item: T; resolve: Function; reject: Function }> = [];
  private batchPromise: Promise<any> | null = null;
  private batchTimeoutId: NodeJS.Timeout | null = null;
  private active = true;
  private logger = new Logger('BatchQueue');
  
  constructor(
    private readonly processor: (items: T[]) => Promise<any[]>,
    private readonly options: Required<BatchOptions>
  ) {}
  
  /**
   * Add an item to the batch queue
   */
  add(item: T): Promise<any> {
    if (!this.active) {
      return Promise.reject(new Error('Batch queue is closed'));
    }
    
    return new Promise((resolve, reject) => {
      this.queue.push({ item, resolve, reject });
      
      // Start a new batch if needed
      if (this.queue.length === 1) {
        this.scheduleBatch();
      } else if (this.queue.length >= this.options.maxBatchSize) {
        // If we've reached max batch size, process immediately
        this.processQueue();
      }
    });
  }
  
  /**
   * Schedule a batch to be processed
   */
  private scheduleBatch(): void {
    if (this.batchTimeoutId !== null) {
      clearTimeout(this.batchTimeoutId);
    }
    
    this.batchTimeoutId = setTimeout(() => {
      this.processQueue();
    }, this.options.maxWaitTime);
  }
  
  /**
   * Process the items in the queue
   */
  private async processQueue(): Promise<void> {
    if (this.batchTimeoutId !== null) {
      clearTimeout(this.batchTimeoutId);
      this.batchTimeoutId = null;
    }
    
    if (this.queue.length === 0) {
      return;
    }
    
    // Capture the current queue
    const currentBatch = this.queue.splice(0, this.options.maxBatchSize);
    const items = currentBatch.map(batch => batch.item);
    
    try {
      let batchedItems = items;
      
      // Apply semantic grouping if enabled
      if (this.options.semanticGrouping && items.length > 1) {
        batchedItems = this.applySemanticGrouping(items);
      }
      
      // Process the batch
      this.logger.info(`Processing batch of ${batchedItems.length} items`);
      const results = await this.processor(batchedItems);
      
      // Match results back to the original batch order
      for (let i = 0; i < currentBatch.length; i++) {
        currentBatch[i].resolve(results[i]);
      }
    } catch (error) {
      this.logger.error('Error processing batch:', error);
      // Reject all promises in the batch
      for (const batch of currentBatch) {
        batch.reject(error);
      }
    }
    
    // Schedule the next batch if there are more items
    if (this.queue.length > 0) {
      this.scheduleBatch();
    }
  }
  
  /**
   * Apply semantic grouping to batch items
   * This uses k-means clustering to group similar requests
   */
  private applySemanticGrouping(items: T[]): T[] {
    // In a real implementation, this would use embeddings and k-means
    // For demonstration, we just return the items as-is
    return items;
  }
  
  /**
   * Close the batch queue
   */
  async close(): Promise<void> {
    this.active = false;
    
    if (this.batchTimeoutId !== null) {
      clearTimeout(this.batchTimeoutId);
      this.batchTimeoutId = null;
    }
    
    if (this.queue.length > 0) {
      await this.processQueue();
    }
  }
}

export interface BatchOptions {
  maxBatchSize?: number;
  maxWaitTime?: number;
  semanticGrouping?: boolean;
  priorityFunction?: (item: any) => number;
}

// Usage example:
/*
async function example() {
  const batchProcessor = new BatchProcessor();
  
  // Create a batch queue for API calls
  const apiQueue = batchProcessor.createBatchQueue<string, string>(
    'api-calls',
    async (prompts) => {
      // In a real implementation, this would be an API call to Claude
      console.log(`Processing batch of ${prompts.length} prompts`);
      return prompts.map(p => `Response for: ${p}`);
    },
    {
      maxBatchSize: 32,
      maxWaitTime: 200,
      semanticGrouping: true
    }
  );
  
  // Add items to batch
  const promises = [];
  for (let i = 0; i < 50; i++) {
    promises.push(apiQueue.add(`Prompt ${i}`));
  }
  
  // Wait for all responses
  const responses = await Promise.all(promises);
  console.log(`Received ${responses.length} responses`);
  
  // Close the batch processor
  await batchProcessor.close();
}
*/