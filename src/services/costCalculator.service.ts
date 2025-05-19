import { PrismaClient } from '@prisma/client';
import { Logger } from '../utils/logger';

/**
 * Implementation of the ClaudeOSaar mathematical cost model
 * as described in the financial documentation.
 * 
 * This service calculates costs and savings from the token
 * optimization strategies including caching, routing, and batching.
 */
export class CostCalculatorService {
  private logger: Logger;
  private prisma: PrismaClient;
  
  // Model pricing per million tokens - based on the model
  private readonly modelPricing = {
    llama: {
      input: 0.10,  // €0.10 per million tokens
      output: 0.15, // €0.15 per million tokens
    },
    haiku: {
      input: 0.80,  // €0.80 per million tokens
      output: 4.00, // €4.00 per million tokens
    },
    sonnet: {
      input: 3.00,  // €3.00 per million tokens
      output: 15.00, // €15.00 per million tokens
    },
    cache: {
      input: 0.30,  // €0.30 per million tokens for cache reads
      output: 0.00, // No cost for output from cache
    }
  };
  
  // Fixed costs for the ClaudeOSaar system
  private readonly fixedCosts = {
    llahaHosting: 205.56, // Monthly LLaMa hosting costs
    infrastructure: 20000, // Monthly infrastructure costs
    development: 25000, // Monthly developer salaries
    operations: 10000, // Monthly operations costs
    marketing: 10000, // Monthly marketing costs
    overhead: 5000, // Monthly overhead
    total: 70205.56 // Total monthly fixed costs
  };
  
  // Price tiers for the ClaudeOSaar system
  private readonly priceTiers = {
    starter: 13.99, // €13.99 per month
    pro: 21.99, // €21.99 per month
    business: 79.99, // €79.99 per month
  };
  
  // Default optimization levels as described in the model
  private readonly defaultOptimizationLevels = {
    cacheHitRate: 0.85, // 85% cache hit rate
    routingEfficiency: 0.65, // 65% savings from intelligent routing
    batchSavings: 0.30, // 30% savings from batch processing
  };
  
  constructor() {
    this.logger = new Logger('CostCalculatorService');
    this.prisma = new PrismaClient();
  }
  
  /**
   * Calculate the base cost without optimizations
   */
  calculateBaseCost(
    inputTokens: number,
    outputTokens: number,
    model: 'llama' | 'haiku' | 'sonnet',
    userCount: number = 1
  ): number {
    const modelConfig = this.modelPricing[model];
    
    // Convert to millions for pricing calculation
    const inputMillions = inputTokens / 1_000_000;
    const outputMillions = outputTokens / 1_000_000;
    
    // Calculate base cost
    const inputCost = inputMillions * modelConfig.input;
    const outputCost = outputMillions * modelConfig.output;
    
    // Add fixed LLaMa hosting cost per user
    const llamaHostingPerUser = this.fixedCosts.llahaHosting / userCount;
    
    const totalCost = inputCost + outputCost + llamaHostingPerUser;
    
    return totalCost;
  }
  
  /**
   * Calculate optimized cost with caching, routing, and batching
   */
  calculateOptimizedCost(
    inputTokens: number,
    outputTokens: number,
    originalModel: 'llama' | 'haiku' | 'sonnet',
    options: OptimizationOptions = {}
  ): CostCalculationResult {
    // Use default optimization levels if not provided
    const cacheHitRate = options.cacheHitRate ?? this.defaultOptimizationLevels.cacheHitRate;
    const routingEfficiency = options.routingEfficiency ?? this.defaultOptimizationLevels.routingEfficiency;
    const batchSavings = options.batchSavings ?? this.defaultOptimizationLevels.batchSavings;
    
    // Calculate the baseline cost without optimization
    const baseCost = this.calculateBaseCost(
      inputTokens,
      outputTokens,
      originalModel,
      options.userCount
    );
    
    // 1. Apply cache savings
    const cacheMissTokens = inputTokens * (1 - cacheHitRate);
    const cacheMissOutputTokens = outputTokens * (1 - cacheHitRate);
    const cacheHitTokens = inputTokens * cacheHitRate;
    
    // Cost of cache hits (only pay for cache read cost)
    const cacheHitCost = (cacheHitTokens / 1_000_000) * this.modelPricing.cache.input;
    
    // 2. Apply routing optimization to remaining tokens (cache misses)
    // Based on the model routing distribution
    const routedTokensCost = this.calculateRoutedCost(
      cacheMissTokens,
      cacheMissOutputTokens,
      originalModel,
      options.modelDistribution
    );
    
    // Savings from routing
    const routingBaseCost = this.calculateBaseCost(
      cacheMissTokens,
      cacheMissOutputTokens,
      originalModel,
      options.userCount
    );
    const routingSavings = routingBaseCost - routedTokensCost;
    
    // 3. Apply batch savings
    // This only applies to API calls, not to cache reads
    const batchSavingsAmount = routedTokensCost * batchSavings;
    
    // Calculate total cost after all optimizations
    const optimizedCost = cacheHitCost + routedTokensCost - batchSavingsAmount;
    
    // Calculate savings
    const totalSavings = baseCost - optimizedCost;
    const savingsPercentage = (totalSavings / baseCost) * 100;
    
    // Break down savings by strategy
    const cacheSavings = baseCost - (routingBaseCost + cacheHitCost);
    const cacheSavingsPercentage = (cacheSavings / baseCost) * 100;
    
    const routingSavingsPercentage = (routingSavings / baseCost) * 100;
    const batchSavingsPercentage = (batchSavingsAmount / baseCost) * 100;
    
    return {
      baseCost,
      optimizedCost,
      totalSavings,
      savingsPercentage,
      breakdown: {
        caching: {
          savings: cacheSavings,
          percentage: cacheSavingsPercentage,
        },
        routing: {
          savings: routingSavings,
          percentage: routingSavingsPercentage,
        },
        batching: {
          savings: batchSavingsAmount,
          percentage: batchSavingsPercentage,
        },
      },
    };
  }
  
  /**
   * Calculate the cost after model routing (distribution of requests)
   */
  private calculateRoutedCost(
    inputTokens: number,
    outputTokens: number,
    originalModel: 'llama' | 'haiku' | 'sonnet',
    modelDistribution?: ModelDistribution
  ): number {
    // Default model distribution from the mathematical model if not provided
    const distribution = modelDistribution || {
      llama: 0.75, // 75% to LLaMa
      haiku: 0.20, // 20% to Haiku
      sonnet: 0.05, // 5% to Sonnet
    };
    
    // Calculate the cost for each model based on distribution
    let totalRoutedCost = 0;
    
    for (const [model, percentage] of Object.entries(distribution)) {
      if (percentage > 0) {
        const modelInputTokens = inputTokens * percentage;
        const modelOutputTokens = outputTokens * percentage;
        
        const modelConfig = this.modelPricing[model as keyof typeof this.modelPricing];
        const inputCost = (modelInputTokens / 1_000_000) * modelConfig.input;
        const outputCost = (modelOutputTokens / 1_000_000) * modelConfig.output;
        
        totalRoutedCost += inputCost + outputCost;
      }
    }
    
    return totalRoutedCost;
  }
  
  /**
   * Calculate gross margin for a given tier
   */
  calculateGrossMargin(tier: 'starter' | 'pro' | 'business'): Promise<GrossMarginResult> {
    // Get the appropriate monthly price
    const price = this.priceTiers[tier];
    
    // Get the typical token usage for this tier
    const tokenUsage = this.getTokenUsageForTier(tier);
    
    // Calculate optimized cost with appropriate parameters
    const result = this.calculateOptimizedCost(
      tokenUsage.inputTokens,
      tokenUsage.outputTokens, 
      tokenUsage.baselineModel,
      {
        userCount: 100, // Assume 100 users for fixed cost distribution
        // Model distribution varies by tier
        modelDistribution: tier === 'business' 
          ? { llama: 0.65, haiku: 0.25, sonnet: 0.10 } // Higher-end models for business
          : tier === 'pro'
          ? { llama: 0.70, haiku: 0.25, sonnet: 0.05 } // Mixed for pro
          : { llama: 0.85, haiku: 0.15, sonnet: 0.00 }, // Mostly LLaMa for starter
      }
    );
    
    // Calculate gross margin
    const grossMargin = price - result.optimizedCost;
    const grossMarginPercentage = (grossMargin / price) * 100;
    
    return Promise.resolve({
      tier,
      price,
      cost: result.optimizedCost,
      grossMargin,
      grossMarginPercentage,
      tokenUsage,
    });
  }
  
  /**
   * Calculate break-even point based on user distribution
   */
  calculateBreakEven(distribution: TierDistribution): BreakEvenResult {
    // Calculate the weighted average margin per user
    let totalMarginPerUser = 0;
    let totalPercentage = 0;
    
    for (const [tier, percentage] of Object.entries(distribution)) {
      const price = this.priceTiers[tier as keyof typeof this.priceTiers];
      const tokenUsage = this.getTokenUsageForTier(tier as 'starter' | 'pro' | 'business');
      
      const result = this.calculateOptimizedCost(
        tokenUsage.inputTokens,
        tokenUsage.outputTokens,
        tokenUsage.baselineModel,
        { userCount: 1000 } // Assume 1000 users for calculation
      );
      
      const margin = price - result.optimizedCost;
      totalMarginPerUser += margin * percentage;
      totalPercentage += percentage;
    }
    
    // Normalize margin
    const avgMarginPerUser = totalMarginPerUser / totalPercentage;
    
    // Calculate break-even
    const breakEvenUsers = this.fixedCosts.total / avgMarginPerUser;
    
    return {
      userDistribution: distribution,
      avgMarginPerUser,
      breakEvenUsers: Math.ceil(breakEvenUsers),
      fixedCosts: this.fixedCosts.total,
    };
  }
  
  /**
   * Get the typical token usage pattern for a given tier
   */
  private getTokenUsageForTier(tier: 'starter' | 'pro' | 'business'): TokenUsage {
    // Based on the mathematical model in the document
    switch (tier) {
      case 'starter':
        return {
          inputTokens: 800_000, // 0.8M input tokens per month
          outputTokens: 200_000, // 0.2M output tokens per month
          baselineModel: 'haiku',
        };
      case 'pro':
        return {
          inputTokens: 1_200_000, // 1.2M input tokens per month
          outputTokens: 400_000, // 0.4M output tokens per month
          baselineModel: 'haiku',
        };
      case 'business':
        return {
          inputTokens: 4_000_000, // 4M input tokens per month
          outputTokens: 1_500_000, // 1.5M output tokens per month
          baselineModel: 'sonnet',
        };
    }
  }
  
  /**
   * Record token usage for a user
   */
  async recordTokenUsage(
    userId: string,
    workspaceId: string,
    inputTokens: number,
    outputTokens: number,
    model: string,
    cacheHit: boolean
  ): Promise<void> {
    try {
      await this.prisma.usageMetric.create({
        data: {
          userId,
          workspaceId,
          inputTokens,
          outputTokens,
          model,
          timestamp: new Date(),
          cacheHit,
          cost: this.calculateTokenCost(inputTokens, outputTokens, model, cacheHit),
        },
      });
    } catch (error) {
      this.logger.error('Failed to record token usage:', error);
    }
  }
  
  /**
   * Calculate the cost for a specific token usage
   */
  private calculateTokenCost(
    inputTokens: number,
    outputTokens: number,
    model: string,
    cacheHit: boolean
  ): number {
    if (cacheHit) {
      // Only pay for cache read cost
      return (inputTokens / 1_000_000) * this.modelPricing.cache.input;
    }
    
    // Convert model name to our cost model key
    let modelKey: keyof typeof this.modelPricing;
    
    if (model.includes('llama') || model.includes('llm')) {
      modelKey = 'llama';
    } else if (model.includes('haiku') || model.includes('claude-3.5')) {
      modelKey = 'haiku';
    } else {
      modelKey = 'sonnet'; // Default to sonnet for any claude-3 or claude-3.7
    }
    
    const modelConfig = this.modelPricing[modelKey];
    const inputCost = (inputTokens / 1_000_000) * modelConfig.input;
    const outputCost = (outputTokens / 1_000_000) * modelConfig.output;
    
    return inputCost + outputCost;
  }
  
  /**
   * Get token usage statistics for a user
   */
  async getUserTokenUsage(
    userId: string,
    period: 'day' | 'week' | 'month' = 'month'
  ): Promise<TokenUsageStats> {
    try {
      // Calculate the date range
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      // Query the database
      const usageEntries = await this.prisma.usageMetric.findMany({
        where: {
          userId,
          timestamp: {
            gte: startDate,
          },
        },
      });
      
      // Calculate totals
      let totalInputTokens = 0;
      let totalOutputTokens = 0;
      let totalCost = 0;
      let cacheHits = 0;
      
      // By model
      const byModel: Record<string, { inputTokens: number; outputTokens: number; cost: number }> = {};
      
      usageEntries.forEach(entry => {
        totalInputTokens += entry.inputTokens;
        totalOutputTokens += entry.outputTokens;
        totalCost += entry.cost;
        
        if (entry.cacheHit) {
          cacheHits++;
        }
        
        // Track by model
        if (!byModel[entry.model]) {
          byModel[entry.model] = { inputTokens: 0, outputTokens: 0, cost: 0 };
        }
        
        byModel[entry.model].inputTokens += entry.inputTokens;
        byModel[entry.model].outputTokens += entry.outputTokens;
        byModel[entry.model].cost += entry.cost;
      });
      
      // Calculate cache hit rate
      const cacheHitRate = usageEntries.length > 0 
        ? cacheHits / usageEntries.length 
        : 0;
      
      // Calculate savings
      let baselineCost = 0;
      // Assuming all traffic would go to sonnet without optimization
      baselineCost = this.calculateBaseCost(
        totalInputTokens,
        totalOutputTokens,
        'sonnet'
      );
      
      const savings = baselineCost - totalCost;
      const savingsPercentage = baselineCost > 0 
        ? (savings / baselineCost) * 100 
        : 0;
      
      return {
        period,
        totalInputTokens,
        totalOutputTokens,
        totalCost,
        cacheHitRate,
        savings,
        savingsPercentage,
        byModel,
      };
    } catch (error) {
      this.logger.error('Failed to get user token usage:', error);
      throw error;
    }
  }
}

// Types for the cost calculator
export interface OptimizationOptions {
  cacheHitRate?: number;
  routingEfficiency?: number;
  batchSavings?: number;
  userCount?: number;
  modelDistribution?: ModelDistribution;
}

export interface ModelDistribution {
  llama: number;
  haiku: number;
  sonnet: number;
}

export interface CostCalculationResult {
  baseCost: number;
  optimizedCost: number;
  totalSavings: number;
  savingsPercentage: number;
  breakdown: {
    caching: {
      savings: number;
      percentage: number;
    };
    routing: {
      savings: number;
      percentage: number;
    };
    batching: {
      savings: number;
      percentage: number;
    };
  };
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  baselineModel: 'llama' | 'haiku' | 'sonnet';
}

export interface GrossMarginResult {
  tier: 'starter' | 'pro' | 'business';
  price: number;
  cost: number;
  grossMargin: number;
  grossMarginPercentage: number;
  tokenUsage: TokenUsage;
}

export interface TierDistribution {
  starter: number;
  pro: number;
  business: number;
}

export interface BreakEvenResult {
  userDistribution: TierDistribution;
  avgMarginPerUser: number;
  breakEvenUsers: number;
  fixedCosts: number;
}

export interface TokenUsageStats {
  period: 'day' | 'week' | 'month';
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  cacheHitRate: number;
  savings: number;
  savingsPercentage: number;
  byModel: Record<string, { inputTokens: number; outputTokens: number; cost: number }>;
}

// Usage example:
/*
async function example() {
  const costCalculator = new CostCalculatorService();
  
  // Calculate optimized cost
  const result = costCalculator.calculateOptimizedCost(
    1_200_000, // 1.2M input tokens
    400_000,   // 400K output tokens
    'haiku',   // Original model
    {
      userCount: 100, // 100 users
      cacheHitRate: 0.85, // 85% cache hit rate
      routingEfficiency: 0.65, // 65% routing efficiency
      batchSavings: 0.30, // 30% batch savings
    }
  );
  
  console.log(`Base cost: €${result.baseCost.toFixed(2)}`);
  console.log(`Optimized cost: €${result.optimizedCost.toFixed(2)}`);
  console.log(`Total savings: €${result.totalSavings.toFixed(2)} (${result.savingsPercentage.toFixed(2)}%)`);
  console.log('Savings breakdown:');
  console.log(`- Caching: €${result.breakdown.caching.savings.toFixed(2)} (${result.breakdown.caching.percentage.toFixed(2)}%)`);
  console.log(`- Routing: €${result.breakdown.routing.savings.toFixed(2)} (${result.breakdown.routing.percentage.toFixed(2)}%)`);
  console.log(`- Batching: €${result.breakdown.batching.savings.toFixed(2)} (${result.breakdown.batching.percentage.toFixed(2)}%)`);
  
  // Calculate margins for each tier
  const starterMargin = await costCalculator.calculateGrossMargin('starter');
  const proMargin = await costCalculator.calculateGrossMargin('pro');
  const businessMargin = await costCalculator.calculateGrossMargin('business');
  
  console.log('\nGross margins by tier:');
  console.log(`- Starter: €${starterMargin.grossMargin.toFixed(2)} (${starterMargin.grossMarginPercentage.toFixed(2)}%)`);
  console.log(`- Pro: €${proMargin.grossMargin.toFixed(2)} (${proMargin.grossMarginPercentage.toFixed(2)}%)`);
  console.log(`- Business: €${businessMargin.grossMargin.toFixed(2)} (${businessMargin.grossMarginPercentage.toFixed(2)}%)`);
  
  // Calculate break-even point
  const breakEven = costCalculator.calculateBreakEven({
    starter: 0.5, // 50% starter
    pro: 0.35, // 35% pro
    business: 0.15 // 15% business
  });
  
  console.log('\nBreak-even analysis:');
  console.log(`- Average margin per user: €${breakEven.avgMarginPerUser.toFixed(2)}`);
  console.log(`- Break-even users: ${breakEven.breakEvenUsers}`);
  console.log(`- Fixed costs: €${breakEven.fixedCosts.toFixed(2)}`);
}
*/