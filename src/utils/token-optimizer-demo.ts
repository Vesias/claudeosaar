import { TokenOptimizer } from './tokenOptimizer';
import { BatchProcessor } from './batchProcessor';
import { VectorCache } from './vectorCache';
import { CostCalculatorService } from '../services/costCalculator.service';

/**
 * Demonstration of the ClaudeOSaar token optimization system
 * 
 * This file shows how the various components work together to provide
 * significant cost optimization through caching, routing, and batching.
 */
async function runTokenOptimizationDemo() {
  console.log('ClaudeOSaar Token Optimization System Demo');
  console.log('-------------------------------------------\n');

  // Initialize the core components
  const tokenOptimizer = new TokenOptimizer();
  const batchProcessor = new BatchProcessor();
  const vectorCache = new VectorCache();
  const costCalculator = new CostCalculatorService();

  await vectorCache.initialize();
  console.log('✅ All components initialized\n');

  // Sample prompts for demonstration
  const samplePrompts = [
    "Explain the benefits of containerized AI development environments",
    "What are the security implications of running AI workspaces in containers?",
    "How can I optimize my Docker containers for Python development?",
    "What are the benefits of containerized AI development environments?", // Duplicate for cache hit
    "Compare Kubernetes and Docker Compose for managing workspaces",
    "Explain the concept of model routing in AI systems",
  ];

  console.log('🔄 Processing sample prompts...\n');

  // Create a batch queue for API calls
  const apiQueue = batchProcessor.createBatchQueue<string, string>(
    'api-calls',
    async (prompts) => {
      console.log(`📦 Processing batch of ${prompts.length} prompts`);
      
      // In a real implementation, this would be an API call to Claude
      // For this demo, we'll just simulate responses
      return prompts.map(p => `Response for: ${p.substring(0, 30)}...`);
    },
    {
      maxBatchSize: 3,
      maxWaitTime: 100,
      semanticGrouping: true
    }
  );

  // Process each prompt using our optimization system
  const results = [];
  
  for (const prompt of samplePrompts) {
    console.log(`\n📝 Processing prompt: "${prompt.substring(0, 40)}..."`);
    
    // Step 1: Check cache first
    console.log('   🔍 Checking cache...');
    const cacheResult = await tokenOptimizer.cacheCheck(prompt, "user123");
    
    if (cacheResult.hit) {
      console.log('   ✅ Cache hit! Using cached response');
      results.push({
        prompt,
        response: cacheResult.cachedResponse,
        fromCache: true,
        modelUsed: 'cache'
      });
      continue;
    }
    
    // Step 2: Route to optimal model
    console.log('   🔄 Cache miss. Routing to optimal model...');
    const modelToUse = await tokenOptimizer.routeToOptimalModel(prompt, { 
      userTier: "pro" 
    });
    console.log(`   🧠 Selected model: ${modelToUse}`);
    
    // Step 3: Add to batch processing queue
    console.log('   📦 Adding to batch processing queue...');
    const response = await apiQueue.add(prompt);
    
    // Step 4: Store result in cache
    console.log('   💾 Storing result in cache...');
    await tokenOptimizer.cacheStore(prompt, response, "user123", cacheResult.vector);
    
    results.push({
      prompt,
      response,
      fromCache: false,
      modelUsed: modelToUse
    });
  }

  // Close the batch processor
  await batchProcessor.close();
  
  // Calculate and display statistics
  console.log('\n📊 Results:');
  console.log('----------------');
  
  const cacheHits = results.filter(r => r.fromCache).length;
  const cacheMisses = results.length - cacheHits;
  const cacheHitRate = (cacheHits / results.length) * 100;
  
  console.log(`Total prompts processed: ${results.length}`);
  console.log(`Cache hits: ${cacheHits} (${cacheHitRate.toFixed(2)}%)`);
  console.log(`Cache misses: ${cacheMisses} (${(100 - cacheHitRate).toFixed(2)}%)`);
  
  // Model distribution
  const modelCounts: Record<string, number> = {};
  results.forEach(r => {
    if (!modelCounts[r.modelUsed]) {
      modelCounts[r.modelUsed] = 0;
    }
    modelCounts[r.modelUsed]++;
  });
  
  console.log('\nModel distribution:');
  Object.entries(modelCounts).forEach(([model, count]) => {
    console.log(`- ${model}: ${count} (${((count / results.length) * 100).toFixed(2)}%)`);
  });
  
  // Calculate cost savings
  console.log('\n💰 Cost Analysis:');
  console.log('----------------');
  
  // Assuming all traffic would otherwise go to sonnet
  const inputTokens = samplePrompts.length * 500;  // 500 tokens per prompt
  const outputTokens = samplePrompts.length * 1000; // 1000 tokens per response
  
  const optimizationResult = costCalculator.calculateOptimizedCost(
    inputTokens,
    outputTokens,
    'sonnet',
    {
      userCount: 100,
      cacheHitRate: cacheHitRate / 100,
      routingEfficiency: 0.65,
      batchSavings: 0.30,
      modelDistribution: {
        llama: 0.70,
        haiku: 0.25,
        sonnet: 0.05
      }
    }
  );
  
  console.log(`Base cost: €${optimizationResult.baseCost.toFixed(4)}`);
  console.log(`Optimized cost: €${optimizationResult.optimizedCost.toFixed(4)}`);
  console.log(`Total savings: €${optimizationResult.totalSavings.toFixed(4)} (${optimizationResult.savingsPercentage.toFixed(2)}%)`);
  
  console.log('\nSavings breakdown:');
  console.log(`- Caching: €${optimizationResult.breakdown.caching.savings.toFixed(4)} (${optimizationResult.breakdown.caching.percentage.toFixed(2)}%)`);
  console.log(`- Routing: €${optimizationResult.breakdown.routing.savings.toFixed(4)} (${optimizationResult.breakdown.routing.percentage.toFixed(2)}%)`);
  console.log(`- Batching: €${optimizationResult.breakdown.batching.savings.toFixed(4)} (${optimizationResult.breakdown.batching.percentage.toFixed(2)}%)`);
  
  // Gross margin analysis
  console.log('\n📈 Business Impact:');
  console.log('------------------');
  
  const starterMargin = await costCalculator.calculateGrossMargin('starter');
  const proMargin = await costCalculator.calculateGrossMargin('pro');
  const businessMargin = await costCalculator.calculateGrossMargin('business');
  
  console.log('Gross margins by tier:');
  console.log(`- Starter (€${starterMargin.price}): €${starterMargin.grossMargin.toFixed(2)} (${starterMargin.grossMarginPercentage.toFixed(2)}%)`);
  console.log(`- Pro (€${proMargin.price}): €${proMargin.grossMargin.toFixed(2)} (${proMargin.grossMarginPercentage.toFixed(2)}%)`);
  console.log(`- Business (€${businessMargin.price}): €${businessMargin.grossMargin.toFixed(2)} (${businessMargin.grossMarginPercentage.toFixed(2)}%)`);
  
  // Break-even analysis
  const breakEven = costCalculator.calculateBreakEven({
    starter: 0.5,  // 50% starter
    pro: 0.35,     // 35% pro
    business: 0.15 // 15% business
  });
  
  console.log('\nBreak-even analysis:');
  console.log(`- Average margin per user: €${breakEven.avgMarginPerUser.toFixed(2)}`);
  console.log(`- Break-even users: ${breakEven.breakEvenUsers}`);
  console.log(`- Fixed costs: €${breakEven.fixedCosts.toFixed(2)}`);
  
  console.log('\n🎉 Token optimization demo complete!');
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runTokenOptimizationDemo().catch(console.error);
}

export { runTokenOptimizationDemo };