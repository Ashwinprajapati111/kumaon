import Header from '../Header.js';
import Footer from '../Footer.js';
import Test from '../Test.js';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import '../../Component/mycss.css';



const product = {
  name: 'Raw Java Plum Honey',
  price: '$140',
  rating: 4,
  images: [
    {
      id: 1,
      name: 'Angled view',
      src: '../images/Raw Java Plum/01.jpg',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    {
      id: 2,
      name: 'Front view',
      src: '../images/Raw Java Plum/02.jpg',
      alt: 'Front view with bag zipped and handles upright.',
    },
    {
      id: 3,
      name: 'Back view',
      src: '../images/Raw Java Plum/03.jpg',
      alt: 'Back view with bag zipped and straps hanging down.',
    },
    {
      id: 4,
      name: 'Back angle open view',
      src: '../images/Raw Java Plum/04.jpg',
      alt: 'Back angled view with bag open and handles to the side.',
    },
    {
      id: 5,
      name: 'Back angle open view',
      src: '../images/Raw Java Plum/05.jpg',
      alt: 'Back angled view with bag open and handles to the side.',
    },

  ],
  colors: [
    { id: 'washed-black', name: 'Washed Black', classes: 'bg-gray-700 checked:outline-gray-700' },
    { id: 'white', name: 'White', classes: 'bg-white checked:outline-gray-400' },
    { id: 'washed-gray', name: 'Washed Gray', classes: 'bg-gray-500 checked:outline-gray-500' },
  ],
  description: `
    <p>Our Raw Organic Java Plum honey is unfiltered and unpasteurised, preserving its natural anti-bacterial, anti-viral, anti-inflammatory and anti-fungal.</p>
  `,
  details: [
    {
      name: 'Properties',
      items: [
        'Rich in vitamins, minerals, anti-oxidants and enzymes, its boosts overall immunity and helps prevent various diseases. Made exclusively by Apis Cerana Indica bees from java plum (jamun) flowers, this honey is sustainably sourced from remote Himalayan villages.',
      ],
    },
    {
      name: 'Ingredients',
      items: [
        'Ingredients - 100% raw, unpasteurised honey',
        'Kumaon Organics Raw Java Plum Honey is a rare, single-region, small-batch honey harvested from the nectar of wild jamun (Syzygium cumini) blossoms in the Himalayan foothills. Naturally darker and richer, jamun honey is known to contain higher levels of polyphenols, flavonoids and anthocyanins—potent antioxidants that help combat oxidative stress and support metabolic health. Its low glycaemic tendency and natural antimicrobial and anti-inflammatory properties make it especially valued for gut health, throat comfort and overall immune support. Rich in prebiotic sugars, it helps nourish beneficial gut bacteria while offering a deep, earthy flavour profile. Enjoy it in warm water, as a natural sweetener, or straight off the spoon—an intentional, functional indulgence for everyday wellness.',
      ],
    },
    {
      name: 'Single-Origin • Himalayan Wild Flora',
      items: [
        'Made from Jamun blossoms — limited seasonal bloom',
        'Never heated, filtered or processed',
        'Naturally dark, mineral-rich & low glycemic',
        'Prebiotic enzymes support digestion & microbiome health',
        'Contains iron, magnesium & naturally occurring micronutrients',
      ],
    },
    {
      name: 'Taste Notes',
      items: [
        '(Real Jamun Blossom Signature Profile)',
        'Smooth',
        'Slightly Tangy',
        'Not Too Sweet',
        'Taste the Himalayas — one spoon at a time.',
      ],
    },
  ],
}
const features = [
  { name: 'Jamun (Java Plum) nectar = naturally higher antioxidant density', description: 'Dark, monofloral honeys consistently show higher total phenolic and flavonoid content than lighter, multi-floral honeys—resulting in stronger antioxidant activity. Jamun (Syzygium cumini) flowers are naturally rich in anthocyanins, phenolic acids, and flavonoids, compounds well known for their role in antioxidant defence and metabolic support. Harvested during the Jamun flowering season in the Kumaon Himalayas, our Raw Java Plum Honey carries botanical richness directly from flower to jar—without dilution or blending.' },
  { name: 'Wild Jamun trees, not cultivated monocultures', description: 'Most commercial dark honeys are sourced from plantation-style crops or agricultural belts, often exposed to higher pesticide and chemical inputs. Jamun trees in the Kumaon region grow wild in forested landscapes, far from intensive farming and chemical agriculture. Research shows that bees foraging in forested, low-intensity ecosystems produce hive products with lower pesticide residue risk compared to heavily cultivated or urban areas.  Our honey reflects this cleaner, more biodiverse Himalayan environment—pure, unindustrialised and closer to nature.' },
  { name: 'True monofloral, single-region, small-batch', description: 'Many so-called “Jamun honeys” on the market are : ●	Heavily blended with other nectars, ●	Heavily blended with other nectars, ●	Ultra-filtered, removing pollen markers and delicate enzymes. Kumaon Organics Raw Java Plum Honey is: ●	Sourced from Himalayan region ●	Harvested in small seasonal batches ●	Raw and gently strained, never overheated or ultra-filtered. This preserves its distinctive deep colour, complex aroma, mild bitterness, and bioactive compounds—the true sensory and functional signature of Jamun honey.' },
  { name: 'Ethical, seasonal and ecosystem-first', description: '●	Seasonal & limited – harvested only when Jamun trees naturally bloom, ●	Farm-to-jar sourcing – supporting local Kumaoni beekeepers, ●	Forest-friendly beekeeping – protecting wild Jamun trees and pollinator habitats. Slow-crafted at altitude, Raw Java Plum Honey is a functional gourmet honey—ideal for mindful daily use, metabolic balance and antioxidant support. Ethically sourced. Botanically specific. Science-aligned. This is Jamun honey in its most authentic form.' },

]

const faqs = [
  {
    id: 1,
    question: "Why is Java Plum (Jamun) honey more watery than other honey?",
    answer:
      "Java plum honey is naturally lighter and more fluid because jamun nectar has a higher natural moisture content. Being raw and unprocessed, the honey is not artificially thickened or dehydrated, so its natural flow is retained.",
  },
  {
    id: 2,
    question: 'Does watery honey mean it is adulterated?',
    answer:
      'No. Texture alone does not indicate purity. Many raw forest and monofloral honeys are naturally runny. Artificially thick honey may actually be processed or blended.',
  },
  {
    id: 3,
    question: 'Is this honey heated or chemically treated?',
    answer:
      "No. This honey is raw and unheated, with no added sugars, syrups or chemicals. Natural variations in texture, color and taste are expected.",
  },
  {
    id: 4,
    question: 'Why does the taste feel slightly strong or astringent?',
    answer: 'Java plum honey has a distinctive natural flavour profile that may include mild bitterness or astringency. This is a normal characteristic of jamun nectar and forest-origin honey.',
  },
  {
    id: 5,
    question: "Will this honey crystallize?",
    answer:
      'Java plum honey typically crystallizes slowly or not at all due to its natural sugar composition. Lack of crystallization does not mean the honey is impure. ',
  },
  {
    id: 6,
    question: 'WIs Java Plum honey suitable for daily use?',
    answer:
      "Yes, it can be enjoyed as part of a balanced diet, like any natural sweetener.",
  },
  ,
  {
    id: 7,
    question: 'Is this honey safe for children?',
    answer:
      "Honey should not be given to infants below 1 year of age.For others, it may be consumed in moderation.",
  },
  ,
  {
    id: 8,
    question: 'Why does the colour vary from batch to batch?',
    answer:
      "Natural factors such as season, region, climate and floral availability can cause variations in colour and taste. These variations indicate authenticity, not inconsistency.",
  },
  ,
  {
    id: 9,
    question: 'How should Java Plum honey be stored?',
    answer:
      "Store in a cool, dry place, away from direct sunlight. Keep it moisture free and always use a dry spoon.",
  },
  ,
  {
    id: 10,
    question: 'What type of bees collect this honey?',
    answer:
      "This honey is collected by native Indian honeybees such as Apis cerana and/or Apis dorsata, depending on the harvest region and season.",
  },
  ,
  {
    id: 11,
    question: 'Why does it smell different from regular honey?',
    answer:
      "Java plum honey has a deep, earthy aroma, typical of forest and jamun blossom nectar. This aroma is natural and varies with each harvest.",
  },
]

const testimonials = [
  {
    body: 'Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.',
    author: {
      name: 'Leslie Alexander',
      handle: 'lesliealexander',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: 'Anim sit consequat culpa commodo eu do nisi commodo ut aute aliqua. Laborum esse duis tempor consectetur officia mollit fugiat. Exercitation qui elit minim minim quis fugiat ex.',
    author: {
      name: 'Michael Foster',
      handle: 'michaelfoster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: 'Consequatur ut atque. Itaque nostrum molestiae id veniam eos cumque.',
    author: {
      name: 'Dries Vincent',
      handle: 'driesvincent',
      imageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: 'Excepteur consectetur deserunt id incididunt veniam mollit officia sint qui aute duis sit cillum. Reprehenderit fugiat amet aliqua in commodo minim sunt laborum.',
    author: {
      name: 'Lindsay Walton',
      handle: 'lindsaywalton',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: 'Distinctio facere aliquam est qui atque sint molestias ad. Fuga consequuntur asperiores voluptatum ipsum.',
    author: {
      name: 'Courtney Henry',
      handle: 'courtneyhenry',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: 'Nam nesciunt dolorem dolor asperiores sint. Incidunt molestiae quis deleniti vitae ut in earum delectus iusto.',
    author: {
      name: 'Tom Cook',
      handle: 'tomcook',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: 'Voluptas quos itaque ipsam in voluptatem est. Iste eos blanditiis repudiandae. Earum deserunt enim molestiae ipsum perferendis.',
    author: {
      name: 'Whitney Francis',
      handle: 'whitneyfrancis',
      imageUrl:
        'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: 'Aliquid dolore praesentium ratione. Cumque ea officia repellendus laboriosam. Vitae quod id explicabo non sunt.',
    author: {
      name: 'Leonard Krasner',
      handle: 'leonardkrasner',
      imageUrl:
        'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    body: 'Molestias ea earum quos nostrum doloremque sed. Quaerat quasi aut velit incidunt excepturi rerum voluptatem minus harum.',
    author: {
      name: 'Floyd Miles',
      handle: 'floydmiles',
      imageUrl:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  return (
    <>
    <Header />
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                {product.images.map((image) => (
                  <Tab
                    key={image.id}
                    className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring-3 focus:ring-indigo-500/50 focus:ring-offset-4 focus:outline-hidden"
                  >
                    <span className="sr-only">{image.name}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <img alt="" src={image.src} className="size-full object-cover" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-indigo-500"
                    />
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels>
              {product.images.map((image) => (
                <TabPanel key={image.id}>
                  <img alt={image.alt} src={image.src} className="aspect-square w-full object-cover sm:rounded-lg" />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">{product.price}</p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        product.rating > rating ? 'text-indigo-500' : 'text-gray-300',
                        'size-5 shrink-0',
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
              </div>
            </div>

            <div className="mt-6 ">
              <h3 className="sr-only">Description</h3>

              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
                className="space-y-6 text-base text-gray-700"
              />
            </div>

            <form className="mt-6">
              {/* Colors
              <div>
                <h3 className="text-sm font-medium text-gray-600">Color</h3>

                <fieldset aria-label="Choose a color" className="mt-2">
                  <div className="flex items-center gap-x-3">
                    {product.colors.map((color) => (
                      <div key={color.id} className="flex rounded-full outline -outline-offset-1 outline-black/10">
                        <input
                          defaultValue={color.id}
                          defaultChecked={color === product.colors[0]}
                          name="color"
                          type="radio"
                          aria-label={color.name}
                          className={classNames(
                            color.classes,
                            'size-8 appearance-none rounded-full forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3',
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div> */}

              <div className="mt-10 flex">
                <button
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden sm:w-full"
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
                  <span className="sr-only">Add to favorites</span>
                </button>
              </div>
            </form>

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {product.details.map((detail) => (
                  <Disclosure key={detail.name} as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-sm font-medium text-gray-900 group-data-open:text-indigo-600">
                          {detail.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="hidden size-6 text-indigo-400 group-hover:text-indigo-500 group-data-open:block"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pb-6">
                      <ul role="list" className="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300">
                        {detail.items.map((item) => (
                          <li key={item} className="pl-2">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </div>
            </section>

          </div>
        </div>
        
      </div>
             {/* dark honey start */}
        <div className="bg-white mt-12">
          <div aria-hidden="true" className="relative">
            <img
              alt=""
              src="Images/Raw Java Plum/Titleback.jpg"
              className="h-96 w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-white" />
          </div>

          <div className="relative mx-auto -mt-6 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
            <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
              <h2 className="mt-10 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Why this is not just another dark honey?</h2>
              <p className="mt-4 text-gray-500">
                What makes Kumaon Organics Raw Java Plum (Jamun) Honey stand out.
              </p>
            </div>

            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-x-8">
              {features.map((feature) => (
                <div key={feature.name} className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">{feature.name}</dt>
                  <dd className="mt-2 text-sm text-gray-500 text-justify">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {/* dark honey ends */}
      {/* faq start */}
        <div className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              
                Frequently asked questions
              </h2>
              
            </div>
            <div className="mt-20">
              <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:space-y-0 sm:gap-x-6 sm:gap-y-16 lg:gap-x-10">
                {faqs.map((faq) => (
                  <div key={faq.id}>
                    <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">{faq.question}</dt>
                    <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-400">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        {/* faq ends */}
        {/* disclaimer start */}
        <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">Disclaimer</h2>
          <p className="mt-5 text-2xl font-semibold tracking-tight text-balance text-gray-900 sm:text-4xl leading-8 discc ">
            This product is a natural  food. Variations in colour, taste, clarity and sediment are natural
          </p>
        </div>

      </div>
    </div>
        {/* disclaimer ends */}
 

    </div>
     <Test />
          
                      <Footer />
                      </>
  )
}
