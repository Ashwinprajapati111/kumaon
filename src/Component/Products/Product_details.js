import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
import Data from "../../Data.json";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";







function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function Example() {
    const { id } = useParams();
    const [SeData, setSeData] = useState([])
    const showdata = async () => {
        const res = await axios.get(`http://localhost:5000/api/products/getone/${id}`);
        setSeData(res.data);

    };
    useEffect(() => {
        showdata();
    }, [id]);
    console.log(SeData)
    const [qty, setQty] = useState(1);
    const increaseQty = () => {
        setQty(qty + 1);
    };

    const decreaseQty = () => {
        if (qty > 1) {
            setQty(qty - 1);
        }
    };


    const addToCart = () => {

        const cartItem = {
            id: SeData._id,
            name: SeData.name,
            price: SeData.price,

            // ✅ FIXED IMAGE URL
            image: SeData.productimages?.[0]
                ? `http://localhost:5000/file/files/${SeData.productimages[0]}`
                : "",

            quantity: qty
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(item => item.id === cartItem.id);

        if (existing) {
            existing.quantity += qty;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        window.dispatchEvent(new Event("cartUpdated"));

        toast.success("Item added to cart 🛒");
    };



    return (
        <>
            <Header />

            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

                    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                        {/* Image gallery */}
                        <TabGroup className="flex flex-col-reverse">
                            {/* Image selector */}
                            <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
                                <TabList className="grid grid-cols-4 gap-6">
                                    {SeData?.productimages?.map((image) => (
                                        <Tab

                                            className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring-3 focus:ring-indigo-500/50 focus:ring-offset-4 focus:outline-hidden"
                                        >
                                            <span className="sr-only">{image.name}</span>
                                            <span className="absolute inset-0 overflow-hidden rounded-md">
                                                <img alt="" src={`http://localhost:5000/file/files/${image}`} className="size-full object-cover" />
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
                                {SeData?.productimages?.map((image) => (
                                    <TabPanel >
                                        <img alt={image.name} src={`http://localhost:5000/file/files/${image}`} className="aspect-square w-full object-cover sm:rounded-lg" />
                                    </TabPanel>
                                ))}
                            </TabPanels>
                        </TabGroup>

                        {/* Product info */}

                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{SeData.name}</h1>

                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl tracking-tight text-gray-900">{SeData.price}</p>
                            </div>



                            <div className="mt-6 ">
                                <h3 className="sr-only">Description</h3>

                                <div
                                    dangerouslySetInnerHTML={{ __html: SeData.desc }}
                                    className="space-y-6 text-base text-gray-700"
                                />
                            </div>

                            {/* ad to cart start */}

                            <div className="mt-6 flex items-center gap-6">

                                {/* Quantity Selector */}

                                <div className="flex items-center border rounded">

                                    <button
                                        type="button"
                                        onClick={decreaseQty}
                                        className="px-3 py-2 text-lg"
                                    >
                                        <MinusIcon className="h-5 w-5" />
                                    </button>

                                    <span className="px-4">{qty}</span>

                                    <button
                                        type="button"
                                        onClick={increaseQty}
                                        className="px-3 py-2 text-lg"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                    </button>

                                </div>

                                {/* Add to Cart Button */}
                                <Link to="/Product/cart">

                                    <button
                                        type="button"
                                        onClick={addToCart}
                                        className="flex items-center justify-center rounded-md bg-indigo-600 px-8 py-3 text-white hover:bg-indigo-700"
                                    >
                                        Add to Cart
                                    </button>
                                </Link>

                            </div>
                            {/* add to cart ends */}
                            <section aria-labelledby="details-heading" className="mt-12">
                                <h2 id="details-heading" className="sr-only">
                                    Additional details
                                </h2>

                                <div className="divide-y divide-gray-200 border-t border-gray-200">

                                    <Disclosure as="div">
                                        <h3>
                                            <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                                                <span className="text-sm font-medium text-gray-900 group-data-open:text-indigo-600">
                                                    Properties
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
                                                {SeData.Properties}
                                            </ul>
                                        </DisclosurePanel>
                                    </Disclosure>
                                    <Disclosure as="div">
                                        <h3>
                                            <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                                                <span className="text-sm font-medium text-gray-900 group-data-open:text-indigo-600">
                                                    Ingredients
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
                                                {SeData.Ingredients}
                                            </ul>
                                        </DisclosurePanel>
                                    </Disclosure>
                                    <Disclosure as="div">
                                        <h3>
                                            <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                                                <span className="text-sm font-medium text-gray-900 group-data-open:text-indigo-600">
                                                    Single Origin
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
                                                {SeData.Single_Origin}
                                            </ul>
                                        </DisclosurePanel>
                                    </Disclosure>
                                    <Disclosure as="div">
                                        <h3>
                                            <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                                                <span className="text-sm font-medium text-gray-900 group-data-open:text-indigo-600">
                                                    Taste Notes
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
                                                {SeData.Taste_Notes}
                                            </ul>
                                        </DisclosurePanel>
                                    </Disclosure>

                                </div>
                            </section>

                        </div>
                    </div>

                </div>
                {/* dark honey start */}
                <div className="bg-white mt-12">
                    <div aria-hidden="true" className="relative">
                        <img
                            alt="test"
                            src={`http://localhost:5000/file/files/${SeData.productbgimage}`}
                            className="h-96 w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-white" />
                    </div>

                    <div className="relative mx-auto -mt-6 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                            <h2 className="mt-10 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{SeData.Why_main_title}</h2>
                        </div>
                        <p className="p-3 m-5 text-center">{SeData.Why_main_desc}</p>

                        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-x-8">
                            {SeData.why?.map((whyy) => (
                                <div key={whyy._id} className="border-t border-gray-200 pt-4">
                                    <dt className="font-medium text-gray-900">{whyy.why_question}</dt>
                                    <dd className="mt-2 text-sm text-gray-500 text-justify">{whyy.why_answer}</dd>
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
                                {SeData.faq?.map((faqq) => (
                                    <div>
                                        <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">{faqq.faq_question}</dt>
                                        <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-400">{faqq.faq_answer}</dd>
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
                                {SeData.Disclaimer}
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
