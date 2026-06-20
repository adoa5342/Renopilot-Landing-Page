import { chromium } from 'playwright';
import fs from 'fs';

const RUNS = 20; 

async function measureLoad(url, label, runs = RUNS) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = [];

  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    await page.goto(url, { waitUntil: 'load' });
    const duration = performance.now() - start;
    results.push(duration);
    console.log(`${label} | Run ${i + 1}/${runs}: ${duration.toFixed(2)} ms`);
    await page.waitForTimeout(500);
  }

  await browser.close();

  const avg = results.reduce((a, b) => a + b, 0) / runs;
  const min = Math.min(...results);
  const max = Math.max(...results);
  const median = results.sort((a, b) => a - b)[Math.floor(runs / 2)];

  console.log(`\n${label} Summary:`);
  console.log(`Average: ${avg.toFixed(2)} ms`);
  console.log(`Min: ${min.toFixed(2)} ms`);
  console.log(`Max: ${max.toFixed(2)} ms`);
  console.log(`Median: ${median.toFixed(2)} ms\n`);

  return { label, average: avg, min, max, median, runs: results };
}

(async () => {
    const tests = [
    { label: 'Landing Page', url: 'http://localhost:3000' },
    { label: 'Homeowners Page', url: 'http://localhost:3000/homeowners' },
    { label: 'Providers Page', url: 'http://localhost:3000/providers' },
    { label: 'Projects Page', url: 'http://localhost:3000/projects' },
    ];


  const results = [];

  for (const t of tests) {
    console.log(`\n=== Running ${t.label} (${RUNS} runs) ===`);
    const res = await measureLoad(t.url, t.label);
    results.push(res);
  }

  fs.writeFileSync('performance-results.json', JSON.stringify(results, null, 2));
  console.log('All tests completed.');
  console.log('Results saved to performance-results.json');
})();
