"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Phone,
  MapPin,
  Mail,
  Send,
  CheckCircle,
} from "lucide-react"

export default function DemoContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", message: "" })
    }, 3000)
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/thmanyah", color: "hover:text-blue-600" },
    { name: "X (Twitter)", icon: Twitter, url: "https://x.com/thmanyah", color: "hover:text-gray-900" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/thmanyah", color: "hover:text-pink-600" },
    { name: "VK", icon: MessageCircle, url: "https://vk.com/thmanyah", color: "hover:text-blue-500" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com/thmanyah", color: "hover:text-red-600" },
    { name: "TikTok", icon: MessageCircle, url: "https://tiktok.com/@thmanyah", color: "hover:text-black" },
    { name: "Snapchat", icon: MessageCircle, url: "https://snapchat.com/add/thmanyah", color: "hover:text-yellow-400" },
    { name: "Telegram", icon: MessageCircle, url: "https://t.me/thmanyah", color: "hover:text-blue-500" },
    { name: "WhatsApp", icon: MessageCircle, url: "https://wa.me/966501234567", color: "hover:text-green-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to listen. Get in touch with us through the form below or via our social media channels
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-center">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-lg font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-2 h-12 text-lg border-2 focus:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-lg font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-2 h-12 text-lg border-2 focus:border-blue-500"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-lg font-medium text-gray-700">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="mt-2 text-lg border-2 focus:border-blue-500 resize-none"
                        placeholder="Write your message here..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="w-6 h-6 mr-2" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information & Social Media */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gray-900 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-center">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600 leading-relaxed">
                        King Fahd Road, Al Olaya District
                        <br />
                        Riyadh 12211, Saudi Arabia
                        <br />
                        P.O. Box: 123456
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Phone</h3>
                        <p className="text-gray-600">
                          <a href="tel:+966501234567" className="hover:text-green-600 transition-colors">
                            +966 50 123 4567
                          </a>
                        </p>
                        <p className="text-gray-600">
                          <a href="tel:+966112345678" className="hover:text-green-600 transition-colors">
                            +966 11 234 5678
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Mail className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Email</h3>
                        <p className="text-gray-600">
                          <a href="mailto:info@thmanyah.com" className="hover:text-purple-600 transition-colors">
                            info@thmanyah.com
                          </a>
                        </p>
                        <p className="text-gray-600">
                          <a href="mailto:support@thmanyah.com" className="hover:text-purple-600 transition-colors">
                            support@thmanyah.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-center">Follow Us on Social Media</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg ${social.color}`}
                    >
                      <social.icon className="w-8 h-8 text-gray-600 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-medium text-gray-700 mt-2 text-center">{social.name}</span>
                    </a>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h4 className="text-lg font-bold text-gray-900 mb-3 text-center">Business Hours</h4>
                  <div className="space-y-2 text-center">
                    <p className="text-gray-600">
                      <span className="font-medium">Sunday - Thursday:</span> 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Friday - Saturday:</span> Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
