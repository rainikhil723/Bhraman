import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import emailjs from '@emailjs/browser';

emailjs.init('ip59GNAKh6uS2Lluf');

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    message: ''
  });

  // EmailJS Configuration - Replace with your actual values
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_hijbnjg',      // Replace with your service ID
    TEMPLATE_ID: 'template_orr8njd',    // Replace with your template ID
    PUBLIC_KEY: 'ip59GNAKh6uS2Lluf'            // Replace with your public key
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear status when user starts typing
    if (status.isSuccess || status.isError) {
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: false,
        message: ''
      });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Please enter your full name'
      });
      return false;
    }
    
    if (!formData.email.trim()) {
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Please enter your email address'
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Please enter a valid email address'
      });
      return false;
    }
    
    if (!formData.message.trim()) {
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Please enter your message'
      });
      return false;
    }
    
    if (formData.message.trim().length < 10) {
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: 'Message must be at least 10 characters long'
      });
      return false;
    }
    
    return true;
  };

  const sendEmailViaEmailJS = async () => {
    try {
      // Initialize EmailJS with your public key
    
      
      // Prepare template parameters
      const templateParams = {
  name: formData.name,
  email: formData.email,
  message: formData.message
};

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);
      return { success: true };
      
    } catch (error) {
      console.error('EmailJS Error:', error);
      throw new Error('Failed to send email. Please check your EmailJS configuration.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStatus({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      message: 'Sending your message...'
    });

    try {
      await sendEmailViaEmailJS();
      
      setStatus({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
    } catch (error) {
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: error.message || 'Failed to send message. Please try again later.'
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get In Touch</h2>
          <p className="text-gray-600">Send us a message and we'll respond within 24 hours</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              placeholder="Enter your full name"
              disabled={status.isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              placeholder="Enter your email address"
              disabled={status.isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleFormChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none hover:border-gray-400"
              placeholder="Tell us about your inquiry..."
              disabled={status.isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 10 characters ({formData.message.length}/10)
            </p>
          </div>

          {/* Status Messages */}
          {(status.isSuccess || status.isError || status.isSubmitting) && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              status.isSuccess ? 'bg-green-50 border border-green-200' :
              status.isError ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              {status.isSubmitting && <Loader className="w-5 h-5 text-blue-600 animate-spin" />}
              {status.isSuccess && <CheckCircle className="w-5 h-5 text-green-600" />}
              {status.isError && <AlertCircle className="w-5 h-5 text-red-600" />}
              <span className={`text-sm font-medium ${
                status.isSuccess ? 'text-green-800' :
                status.isError ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {status.message}
              </span>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={status.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {status.isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
        </div>

        {/* Setup Instructions */}
        
      </div>
    </div>
  );
};

export default ContactForm;