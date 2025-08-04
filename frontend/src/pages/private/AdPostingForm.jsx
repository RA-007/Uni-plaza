import React, { useState } from 'react'
import { 
  FileText, 
  Image, 
  Tag, 
  MapPin, 
  Link, 
  Phone, 
  Mail, 
  Plus, 
  X,
  Upload,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'
import api from '../services/api.js'

const AdPostingForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    tags: '',
    location: '',
    actionLinks: [
      { label: '', url: '' }
    ],
    contactEmail: '',
    contactPhone: ''
  })

  const [previewImage, setPreviewImage] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear messages when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      setUploadingImage(true)
      setError('')

      try {
        // Upload image to backend
        const response = await api.uploadImage(file)
        setFormData(prev => ({ 
          ...prev, 
          image: response.data.url 
        }))
        setPreviewImage(response.data.url)
        setSuccess('Image uploaded successfully!')
      } catch (error) {
        setError(error.message || 'Failed to upload image')
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleActionLinkChange = (index, field, value) => {
    const newLinks = [...formData.actionLinks]
    newLinks[index][field] = value
    setFormData(prev => ({ ...prev, actionLinks: newLinks }))
  }

  const addActionLink = () => {
    if (formData.actionLinks.length < 3) {
      setFormData(prev => ({
        ...prev,
        actionLinks: [...prev.actionLinks, { label: '', url: '' }]
      }))
    }
  }

  const removeActionLink = (index) => {
    const newLinks = formData.actionLinks.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, actionLinks: newLinks }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      // Filter out empty action links
      const adData = {
        ...formData,
        actionLinks: formData.actionLinks.filter(link => link.label && link.url)
      }

      // Submit to backend
      const response = await api.createAd(adData)
      
      setSuccess('Advertisement posted successfully!')
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          image: null,
          tags: '',
          location: '',
          actionLinks: [{ label: '', url: '' }],
          contactEmail: '',
          contactPhone: ''
        })
        setPreviewImage(null)
        setSuccess('')
      }, 2000)

    } catch (error) {
      setError(error.message || 'Failed to post advertisement')
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      image: null,
      tags: '',
      location: '',
      actionLinks: [{ label: '', url: '' }],
      contactEmail: '',
      contactPhone: ''
    })
    setPreviewImage(null)
    setError('')
    setSuccess('')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Advertisement</h2>
        <button
          type="button"
          onClick={togglePreview}
          className="btn-secondary flex items-center"
        >
          {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {showPreview && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-xl">{formData.title || 'Ad Title'}</h4>
            </div>
            {previewImage && (
              <div>
                <img src={previewImage} alt="Ad preview" className="w-full max-w-md rounded-lg" />
              </div>
            )}
            <div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {formData.description || 'Ad description will appear here...'}
              </p>
            </div>
            {formData.tags && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.split(',').map((tag, index) => (
                  <span key={index} className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            {formData.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {formData.location}
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Ad Title */}
        <div>
          <label className="form-label flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Ad Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Hiring: Graphic Designer – Colombo Office"
            className="form-input"
            required
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-500 mt-1">Write a short and clear headline</p>
        </div>

        {/* 2. Ad Description */}
        <div>
          <label className="form-label">Ad Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Include job responsibilities, requirements, benefits, duration, etc."
            className="form-input min-h-[120px] resize-y"
            required
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-500 mt-1">
            Include: Job responsibilities, requirements, benefits, duration or deadline
          </p>
        </div>

        {/* 3. Ad Image */}
        <div>
          <label className="form-label flex items-center">
            <Image className="w-4 h-4 mr-2" />
            Ad Image or Poster
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
              disabled={uploadingImage || isSubmitting}
            />
            <label htmlFor="image-upload" className={`cursor-pointer ${(uploadingImage || isSubmitting) ? 'opacity-50' : ''}`}>
              {uploadingImage ? (
                <Loader2 className="w-8 h-8 mx-auto text-primary-600 mb-2 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              )}
              <p className="text-gray-600">
                {uploadingImage ? 'Uploading...' : 'Click to upload JPG/PNG banner or poster'}
              </p>
              <p className="text-sm text-gray-500">Max size: 5MB</p>
            </label>
          </div>
          {previewImage && (
            <div className="mt-4">
              <img src={previewImage} alt="Preview" className="w-full max-w-md rounded-lg" />
            </div>
          )}
        </div>

        {/* 4. Tags */}
        <div>
          <label className="form-label flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Tags / Keywords
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            placeholder="e.g., #Internship, #RemoteJob, #FullTime, #Colombo"
            className="form-input"
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-500 mt-1">Use hashtags for better search and filtering</p>
        </div>

        {/* 5. Location */}
        <div>
          <label className="form-label flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Location (Optional)
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Colombo, Sri Lanka"
            className="form-input"
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-500 mt-1">Relevant location for the job/event/offer</p>
        </div>

        {/* 6. Action Links */}
        <div>
          <label className="form-label flex items-center">
            <Link className="w-4 h-4 mr-2" />
            Action Links (Optional)
          </label>
          <div className="space-y-3">
            {formData.actionLinks.map((link, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleActionLinkChange(index, 'label', e.target.value)}
                  placeholder="Label (e.g., Apply Now)"
                  className="form-input flex-1"
                  disabled={isSubmitting}
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleActionLinkChange(index, 'url', e.target.value)}
                  placeholder="URL (e.g., https://...)"
                  className="form-input flex-1"
                  disabled={isSubmitting}
                />
                {formData.actionLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeActionLink(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {formData.actionLinks.length < 3 && (
              <button
                type="button"
                onClick={addActionLink}
                className="btn-secondary flex items-center"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Add up to 3 links (application forms, websites, etc.)</p>
        </div>

        {/* 7. Contact Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Contact Information (Optional)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="your@email.com"
                className="form-input"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="form-label flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+94 11 234 5678"
                className="form-input"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Include for direct contact (optional if same as profile)</p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            className="btn-primary flex-1 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              'Post Advertisement'
            )}
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdPostingForm 