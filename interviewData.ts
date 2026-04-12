
export interface InterviewQuestion {
    id: number;
    category: string;
    title: string;
    question: string;
    answer: string;
    context: string;
    tags: string[];
}

export const INTERVIEW_DATA: InterviewQuestion[] = [
    // JAVASCRIPT & TYPESCRIPT
    {
        id: 1,
        category: "JavaScript & TypeScript",
        title: "Event Loop & Concurrency",
        question: "In the context of a trading dashboard with multiple WebSocket feeds, how do you manage the task queue to ensure that UI interactions (like clicking 'Sell') are never blocked by heavy data processing in the microtask queue?",
        answer: "Prioritize UI responsiveness by offloading heavy data transformations to Web Workers or breaking up long-running tasks using requestIdleCallback or setTimeout(0). Since microtasks (Promises) run before the next render, a flooded microtask queue will freeze the UI. Use a 'producer-consumer' pattern where WebSocket data is buffered and processed in chunks.",
        context: "Trading platforms, real-time data streaming.",
        tags: ["Event Loop", "WebSockets", "Performance"]
    },
    {
        id: 2,
        category: "JavaScript & TypeScript",
        title: "Memory Management: WeakMap vs Map",
        question: "Explain the difference between a WeakMap and a standard Map. In what scenario would you use a WeakMap when architecting a 3D scene where objects are dynamically created and destroyed?",
        answer: "A Map holds strong references to keys, preventing garbage collection. A WeakMap holds weak references; if the object key has no other references, it is collected. In 3D (Three.js), use WeakMap to associate metadata (like physics properties) with meshes without preventing the mesh from being disposed of when removed from the scene.",
        context: "Memory management in 3D/Canvas environments.",
        tags: ["Memory", "Garbage Collection", "Three.js"]
    },
    {
        id: 3,
        category: "JavaScript & TypeScript",
        title: "Advanced TypeScript: 'infer'",
        question: "How would you use the 'infer' keyword to create a generic type that extracts the return value of an asynchronous function? Why is this useful for the Shopify Admin API?",
        answer: "type UnpackPromise<T> = T extends Promise<infer U> ? U : T; This allows you to automatically derive the payload type from API wrapper functions without manual re-declaration, ensuring type-safe access to complex GraphQL response shapes in Shopify.",
        context: "Type safety for complex API responses.",
        tags: ["TypeScript", "Generics", "Shopify API"]
    },
    // REACT & NEXT.JS
    {
        id: 4,
        category: "React & Next.js",
        title: "Streaming & Suspense Strategy",
        question: "When designing a Product Detail Page (PDP) in Next.js, how do you decide where to place Suspense boundaries? Walk me through a streaming strategy.",
        answer: "Wrap low-priority or slow components (Reviews, Related Products) in Suspense. Fetch high-priority data (Title, Price, Main Image) at the page level or in the 'shell'. This allows the user to see the product instantly while the rest of the page 'streams' in, improving Largest Contentful Paint (LCP).",
        context: "E-commerce performance (Core Web Vitals).",
        tags: ["Next.js", "Suspense", "Streaming"]
    },
    {
        id: 5,
        category: "React & Next.js",
        title: "Server Actions & Optimistic UI",
        question: "Explain how to implement a 'Wishlist' feature using Next.js Server Actions. How do you handle 'Optimistic UI' updates?",
        answer: "Use the 'useOptimistic' hook to immediately update the heart icon's state. Then, call the Server Action to update the database. If the server fails, the hook automatically reverts the UI state. This prevents the perceived latency of waiting for a round-trip to the server.",
        context: "User experience in dynamic e-commerce features.",
        tags: ["Server Actions", "Next.js", "UX"]
    },
    // SHOPIFY
    {
        id: 6,
        category: "Shopify",
        title: "Extensibility: Checkout Extensions",
        question: "A merchant wants to use checkout.liquid for a custom upsell. How do you explain the benefits of migrating to 'Checkout UI Extensions' instead?",
        answer: "Checkout UI Extensions are upgrade-safe, sandboxed, and highly performant. Unlike checkout.liquid, which can break when Shopify updates its core, Extensions use a declarative API that ensures security and preserves the merchant's ability to use the one-page checkout and other future features.",
        context: "Modernizing Shopify storefronts.",
        tags: ["Shopify OS 2.0", "Security", "Extensibility"]
    },
    {
        id: 7,
        category: "Shopify",
        title: "Shopify Functions & Rust",
        question: "You need to implement a 'Buy 3 Get 10% Off' discount for a specific collection. Walk me through the GraphQL input query and WASM logic.",
        answer: "The GraphQL query fetches the cart line items and their collection IDs. The Rust logic iterates through lines, counts items from the specific collection, and returns a 'discount application' object if the count >= 3. Compiled to WASM, this runs on Shopify's servers in <5ms.",
        context: "Backend logic for discounts and shipping.",
        tags: ["Shopify Functions", "Rust", "WASM"]
    },
    // ANGULAR
    {
        id: 8,
        category: "Angular",
        title: "Signals vs RxJS",
        question: "For a complex multi-step checkout form in Angular, when would you use Signals vs. RxJS Subjects? How do they differ in memory footprint?",
        answer: "Use Signals for local UI state (show/hide, simple inputs) as they provide fine-grained reactivity and better performance. Use RxJS for asynchronous orchestrations (debounced API searches, complex event streams). Signals are generally lighter as they don't require the subscription overhead of observables.",
        context: "Enterprise state management.",
        tags: ["Angular 17+", "Signals", "RxJS"]
    },
    // SPECIALIZED (3D/WEB3)
    {
        id: 9,
        category: "Specialized (3D & Web3)",
        title: "GPGPU Physics Systems",
        question: "How does a 'DataTexture' differ from a standard image texture in Three.js? Explain its role in a particle system.",
        answer: "A standard texture stores colors (RGB). A DataTexture stores raw float values (XYZ positions or velocities). In a GPGPU system, we use these textures as frame buffers where a shader calculates particle movement, allowing the GPU to simulate millions of particles simultaneously.",
        context: "High-performance immersive web experiences.",
        tags: ["Three.js", "WebGL", "GPGPU"]
    },
    {
        id: 10,
        category: "Specialized (3D & Web3)",
        title: "Solana Transaction Lifecycle",
        question: "When building a DEX dashboard, how do you manage transaction retries and congestion on Solana?",
        answer: "Use a custom retry loop with exponential backoff. Monitor the 'commitment' level (confirmed vs finalized). Use a dedicated RPC provider to avoid public rate limits and implement 'Priority Fees' via the Compute Budget program to ensure transactions land during high congestion.",
        context: "Blockchain engineering and reliability.",
        tags: ["Solana", "Web3", "Solana-web3.js"]
    }
];

export const CATEGORIES = ["All", "JavaScript & TypeScript", "React & Next.js", "Shopify", "Angular", "Specialized (3D & Web3)"];
