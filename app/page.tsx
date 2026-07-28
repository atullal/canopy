export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-4xl font-bold">Canopy</h1>
        <p className="text-xl max-w-2xl text-gray-700">
          Free, patient, zero-risk interactive simulators for older adults.
        </p>
        
        <div className="w-full mt-8">
          <h2 className="text-2xl font-semibold mb-6">Interactive Practice Simulators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <a 
              href="/phishing-inbox" 
              className="group block border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                🛡️ Practice Inbox: Spot the Scam &rarr;
              </h3>
              <p className="text-gray-600">
                A safe, interactive environment to practice spotting scam emails. No real money or personal information is connected here.
              </p>
            </a>
            
            <a 
              href="/fake-checkout" 
              className="group block border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                🛒 Practice Checkout: Safe Payments &rarr;
              </h3>
              <p className="text-gray-600">
                A zero-risk sandbox where you can practice checking website addresses for tricks and choosing the safest payment method.
              </p>
            </a>
            
            <a 
              href="/urgent-text-message" 
              className="group block border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                📱 Practice Text Messages: Golden Rule &rarr;
              </h3>
              <p className="text-gray-600">
                A safe space to practice reading text messages, looking for signs of scams, and safely deleting them without fear.
              </p>
            </a>

            <a 
              href="/storage-full-gallery" 
              className="group block border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                🖼️ Practice Photo Gallery: Storage Full &rarr;
              </h3>
              <p className="text-gray-600">
                A zero-risk sandbox where you can practice making space by deleting unwanted photos, and learn how to use the 'Recently Deleted' folder.
              </p>
            </a>

            <a 
              href="/update-screen" 
              className="group block border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                ⚙️ Practice Updates: Real or Fake? &rarr;
              </h3>
              <p className="text-gray-600">
                A safe sandbox to practice telling the difference between real, safe device updates and fake, scary internet pop-up tricks.
              </p>
            </a>

            <a 
              href="/app-permissions" 
              className="group block border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                ✋ Practice App Install: Permissions &rarr;
              </h3>
              <p className="text-gray-600">
                A zero-risk sandbox where you can practice thinking critically about what personal information an app actually needs to do its job.
              </p>
            </a>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Evergreen Digital Academy (Canopy)
      </footer>
    </div>
  );
}
