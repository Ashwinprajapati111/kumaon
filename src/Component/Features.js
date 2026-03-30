export default function Example() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        {/* Details section */}
        <section aria-labelledby="details-heading">
          <div className="flex flex-col items-center text-center">
            <h2 id="details-heading" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              The Kumaon Difference
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-gray-600">
              Rooted in the pristine Uttarakhand Himalayas, our products are carefully sourced and minimally processed to bring you purity, authenticity and everyday wellness straight from nature.

            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8">
            <div>
              <img
                alt="Drawstring top with elastic loop closure and textured interior padding."
                src="Images/all product aa.jpg"
                className="aspect-3/2 w-full rounded-lg object-cover"
              />
              <p className="mt-8 text-base text-gray-500">
Every Kumaon Organics’ product reflects careful harvesting, small-batch processing and a commitment to preserving nature’s original nutrients and flavours.
              </p>
            </div>
            <div>
              <img
                alt="Front zipper pouch with included key ring."
                src="Images/all product2.jpg"
                className="aspect-3/2 w-full rounded-lg object-cover"
              />
              <p className="mt-8 text-base text-gray-500">
Each Kumaon Organics’ product is made to support a cleaner, more natural lifestyle without artificial processing or shortcuts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
