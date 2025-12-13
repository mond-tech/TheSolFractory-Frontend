"use client";

import React, { useState } from "react";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import FullPageLoader from "@/src/components/FullPageLoader";

export default function ContactPage() {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isMobile === null) return <FullPageLoader />;

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "hello@solfrance.com",
      link: "mailto:hello@solfrance.com",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (897) 654-3210",
      link: "tel:+18976543210",
    },
    {
      icon: MapPin,
      title: "Address",
      content: "123 Factory Street, Industrial District",
      link: "#",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon - Fri: 8 AM to 8 PM",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-[#132135]">
      <Navbar />
      <main className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get in <span className="text-blue-400">Touch</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Have a question or want to discuss your custom order? We're here
              to help. Reach out and we will get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Contact Info Cards - Left Side */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <a
                    key={index}
                    href={info.link}
                    className="block group"
                  >
                    <Card className="relative bg-gray-800/50 border border-gray-700 p-6 hover:border-blue-400/50 transition-all duration-300 overflow-hidden">
                      <GlowingEffect
                        glow={true}
                        disabled={false}
                        proximity={80}
                        spread={60}
                      />
                      <div className="relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-400/30 group-hover:bg-blue-600/30 transition-colors">
                            <Icon className="h-6 w-6 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold mb-1">
                              {info.title}
                            </h3>
                            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                              {info.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </a>
                );
              })}
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-2">
              <Card className="relative bg-gray-800/50 border border-gray-700 p-6 md:p-10 overflow-hidden">
                <GlowingEffect
                  glow={true}
                  disabled={false}
                  proximity={100}
                  spread={80}
                />
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                    Send us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-black/60 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-black/60 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/50"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-300">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="bg-black/60 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/50"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="bg-black/60 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/50 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <HoverBorderGradient
                        as="button"
                        type="submit"
                        containerClassName="w-full md:w-auto"
                        className="w-full md:w-auto bg-[#132135] text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#132135]/90 transition-colors"
                      >
                        <Send className="h-5 w-5" />
                        Send Message
                      </HoverBorderGradient>
                    </div>
                  </form>
                </div>
              </Card>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 md:mt-16">
            <Card className="relative bg-gray-800/30 border border-gray-700/50 p-6 md:p-8 overflow-hidden">
              <GlowingEffect
                glow={true}
                disabled={false}
                proximity={120}
                spread={100}
              />
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      Quick Response
                    </h3>
                    <p className="text-gray-400 text-sm">
                      We typically respond within 24 hours
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      Expert Support
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Our team is here to help with any questions
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      Custom Solutions
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Discuss your unique requirements with us
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
