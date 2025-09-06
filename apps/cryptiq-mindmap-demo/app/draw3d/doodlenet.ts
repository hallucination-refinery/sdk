"use client";
let classifierPromise: Promise<any> | null = null;
let modelLoadMs = 0;

async function ensureMl5(): Promise<any> {
  if ((window as any).ml5) return (window as any).ml5;
  return new Promise((resolve) => {
    const check = () => {
      if ((window as any).ml5) {
        resolve((window as any).ml5);
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });
}

export async function loadDoodleNet() {
  if (!classifierPromise) {
    const ml5 = await ensureMl5();
    const start = performance.now();
    classifierPromise = new Promise((resolve, reject) => {
      ml5.imageClassifier('DoodleNet', (err: any, classifier: any) => {
        if (err) {
          reject(err);
          return;
        }
        modelLoadMs = performance.now() - start;
        console.log(`DoodleNet loaded in ${modelLoadMs.toFixed(1)}ms`);
        resolve(classifier);
      });
    });
  }
  const classifier = await classifierPromise;
  return { classifier, loadMs: modelLoadMs };
}

export async function classify(canvas: HTMLCanvasElement, topK = 3) {
  const { classifier } = await loadDoodleNet();
  const start = performance.now();
  const results = await classifier.classify(canvas, topK);
  const inferenceMs = performance.now() - start;
  console.log(`DoodleNet inference in ${inferenceMs.toFixed(1)}ms`, results);
  return { results, inferenceMs, loadMs: modelLoadMs };
}
