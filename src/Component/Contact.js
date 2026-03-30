import React, { useState } from 'react'
import axios from "axios"
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import Header from '../Component/Header.js'
import Footer from '../Component/Footer.js'
import Test from '../Component/Test.js'

const Contact = () => {

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        message: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            await axios.post("http://localhost:5000/contact/post", formData)

            alert("Message sent successfully")

            setFormData({
                firstname: "",
                lastname: "",
                email: "",
                phone: "",
                message: ""
            })

        } catch (error) {
            console.error(error)
            alert("Error sending message")
        }
    }

    return (
        <>
            <Header />

            <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>

                <div className="relative isolate bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/images/contactback.jpg')"
                    }}>

                    <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">

                        {/* Left Side Contact Info */}
                        <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48">

                            <h2 className="text-4xl font-semibold text-gray-900">
                                Get in touch
                            </h2>

                            <dl className="mt-10 space-y-4 text-base text-gray-600">

                                <div className="flex gap-x-4">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd" />
                                    </svg>

                                    <dd>
                                         @kumaonorganics
                                    </dd>
                                </div>

                                <div className="flex gap-x-4">
                                    <PhoneIcon className="h-7 w-6 text-gray-400" />
                                    <dd>+91-9662963448</dd>
                                </div>

                                <div className="flex gap-x-4">
                                    <EnvelopeIcon className="h-7 w-6 text-gray-400" />
                                    <dd>kumaonorganic@gmail.com</dd>
                                </div>

                            </dl>

                        </div>


                        {/* Contact Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48"
                        >

                            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">

                                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900">
                                            First name
                                        </label>

                                        <input
                                            type="text"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-md border px-3 py-2"
                                        />
                                    </div>


                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900">
                                            Last name
                                        </label>

                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-md border px-3 py-2"
                                        />
                                    </div>


                                    {/* Email */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-900">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-md border px-3 py-2"
                                        />
                                    </div>


                                    {/* Phone */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-900">
                                            Phone number
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-md border px-3 py-2"
                                        />
                                    </div>


                                    {/* Message */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-900">
                                            Message
                                        </label>

                                        <textarea
                                            name="message"
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="mt-2 w-full rounded-md border px-3 py-2"
                                        />
                                    </div>

                                </div>

                                {/* Submit */}
                                <div className="mt-8 flex justify-end">

                                    <button
                                        type="submit"
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-white"
                                    >
                                        Send message
                                    </button>

                                </div>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

            <Test />
            <Footer />
        </>
    )
}

export default Contact