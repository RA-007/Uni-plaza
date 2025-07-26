import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { eventAdsAPI } from './services/api';
import DynamicInput from './components/DynamicInput';
import FileUpload from './components/FileUpload';
import styles from './ClubDashboard.module.css';

const EventAds = () => {
  const [eventAds, setEventAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    evntAdTitle: '',
    evntAdDate: '',
    evntAdTime: '',
    evntAdDescription: '',
    university: '',
    evntAdLocation: '',
    contactNumber: [''],
    evntAdImage: [],
    evntAdTags: [''],
    evntAdRelatedLinks: [''],
    evntAdStatus: 'active'
  });

  useEffect(() => {
    fetchEventAds();
  }, []);

  const fetchEventAds = async () => {
    try {
      setLoading(true);
      const response = await eventAdsAPI.getAll();
      setEventAds(response.data);
    } catch (error) {
      console.error('Error fetching event ads:', error);
      setEventAds([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.evntAdTitle.trim()) {
      newErrors.evntAdTitle = 'Event title is required';
    }
    if (!formData.evntAdDate) {
      newErrors.evntAdDate = 'Event date is required';
    }
    if (!formData.evntAdTime.trim()) {
      newErrors.evntAdTime = 'Event time is required';
    }
    if (!formData.evntAdDescription.trim()) {
      newErrors.evntAdDescription = 'Event description is required';
    }
    if (!formData.university.trim()) {
      newErrors.university = 'University name is required';
    }
    if (formData.contactNumber.filter(num => num.trim()).length === 0) {
      newErrors.contactNumber = 'At least one contact number is required';
    }
    if (formData.evntAdTags.filter(tag => tag.trim()).length === 0) {
      newErrors.evntAdTags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        contactNumber: formData.contactNumber.filter(num => num.trim()),
        evntAdTags: formData.evntAdTags.filter(tag => tag.trim()),
        evntAdRelatedLinks: formData.evntAdRelatedLinks.filter(link => link.trim()),
      };

      if (editingAd) {
        await eventAdsAPI.update(editingAd._id, submitData);
      } else {
        await eventAdsAPI.create(submitData);
      }

      setShowModal(false);
      setEditingAd(null);
      resetForm();
      fetchEventAds();
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: editingAd ? 'Event ad updated successfully!' : 'Event ad created successfully!',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      console.error('Error saving event ad:', error);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'Error saving event ad. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      evntAdTitle: ad.evntAdTitle || '',
      evntAdDate: ad.evntAdDate ? ad.evntAdDate.split('T')[0] : '',
      evntAdTime: ad.evntAdTime || '',
      evntAdDescription: ad.evntAdDescription || '',
      university: ad.university || '',
      evntAdLocation: ad.evntAdLocation || '',
      contactNumber: ad.contactNumber && ad.contactNumber.length > 0 ? ad.contactNumber : [''],
      evntAdImage: ad.evntAdImage || [],
      evntAdTags: ad.evntAdTags && ad.evntAdTags.length > 0 ? ad.evntAdTags : [''],
      evntAdRelatedLinks: ad.evntAdRelatedLinks && ad.evntAdRelatedLinks.length > 0 ? ad.evntAdRelatedLinks : [''],
      evntAdStatus: ad.evntAdStatus || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this event ad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await eventAdsAPI.delete(id);
        fetchEventAds();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The event ad has been deleted.',
          confirmButtonColor: '#3085d6'
        });
      } catch (error) {
        console.error('Error deleting event ad:', error);
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Error deleting event ad. Please try again.',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      evntAdTitle: '',
      evntAdDate: '',
      evntAdTime: '',
      evntAdDescription: '',
      university: '',
      evntAdLocation: '',
      contactNumber: [''],
      evntAdImage: [],
      evntAdTags: [''],
      evntAdRelatedLinks: [''],
      evntAdStatus: 'active'
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const filteredAds = eventAds.filter(ad =>
    ad.evntAdTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.evntAdTags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingAd(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <div className={styles.loading}>Loading event ads...</div>;
  }

  return (
    <div>
      <div className={styles.actionsSection}>
        <button onClick={openAddModal} className={styles.addButton}>
          Add New Event Ad
        </button>
        <input
          type="text"
          placeholder="Search event ads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date & Time</th>
            <th>University</th>
            <th>Location</th>
            <th>Tags</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAds.length === 0 ? (
            <tr>
              <td colSpan="7" className={styles.noData}>
                No event ads found
              </td>
            </tr>
          ) : (
            filteredAds.map((ad) => (
              <tr key={ad._id}>
                <td>{ad.evntAdTitle}</td>
                <td>
                  {ad.evntAdDate && new Date(ad.evntAdDate).toLocaleDateString()}
                  <br />
                  {ad.evntAdTime}
                </td>
                <td>{ad.university}</td>
                <td>{ad.evntAdLocation || 'N/A'}</td>
                <td>
                  <div className={styles.tags}>
                    {ad.evntAdTags?.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[`status${ad.evntAdStatus === 'active' ? 'Active' : 'Inactive'}`]}`}>
                    {ad.evntAdStatus}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => handleEdit(ad)}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ad._id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingAd ? 'Edit Event Ad' : 'Add New Event Ad'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Event Title <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="evntAdTitle"
                    value={formData.evntAdTitle}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.evntAdTitle ? styles.error : ''}`}
                    placeholder="Enter event title"
                  />
                  {errors.evntAdTitle && (
                    <div className={styles.errorMessage}>{errors.evntAdTitle}</div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    University <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.university ? styles.error : ''}`}
                    placeholder="Enter university name"
                  />
                  {errors.university && (
                    <div className={styles.errorMessage}>{errors.university}</div>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Event Date <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="evntAdDate"
                    value={formData.evntAdDate}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.evntAdDate ? styles.error : ''}`}
                  />
                  {errors.evntAdDate && (
                    <div className={styles.errorMessage}>{errors.evntAdDate}</div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Event Time <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input
                    type="time"
                    name="evntAdTime"
                    value={formData.evntAdTime}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.evntAdTime ? styles.error : ''}`}
                  />
                  {errors.evntAdTime && (
                    <div className={styles.errorMessage}>{errors.evntAdTime}</div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Event Location
                </label>
                <input
                  type="text"
                  name="evntAdLocation"
                  value={formData.evntAdLocation}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter event location"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Event Description <span style={{ color: '#d32f2f' }}>*</span>
                </label>
                <textarea
                  name="evntAdDescription"
                  value={formData.evntAdDescription}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${errors.evntAdDescription ? styles.error : ''}`}
                  placeholder="Enter event description"
                  rows="4"
                />
                {errors.evntAdDescription && (
                  <div className={styles.errorMessage}>{errors.evntAdDescription}</div>
                )}
              </div>

              <DynamicInput
                label="Contact Numbers"
                items={formData.contactNumber}
                onItemsChange={(items) => setFormData(prev => ({ ...prev, contactNumber: items }))}
                placeholder="Enter contact number"
                required={true}
              />
              {errors.contactNumber && (
                <div className={styles.errorMessage}>{errors.contactNumber}</div>
              )}

              <DynamicInput
                label="Event Tags"
                items={formData.evntAdTags}
                onItemsChange={(items) => setFormData(prev => ({ ...prev, evntAdTags: items }))}
                placeholder="Enter event tag"
                required={true}
              />
              {errors.evntAdTags && (
                <div className={styles.errorMessage}>{errors.evntAdTags}</div>
              )}

              <DynamicInput
                label="Related Links"
                items={formData.evntAdRelatedLinks}
                onItemsChange={(items) => setFormData(prev => ({ ...prev, evntAdRelatedLinks: items }))}
                placeholder="Enter related link URL"
                required={false}
              />

              <FileUpload
                label="Event Images"
                files={formData.evntAdImage}
                onFilesChange={(files) => setFormData(prev => ({ ...prev, evntAdImage: files }))}
                accept="image/*"
                multiple={true}
              />

              <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <select
                  name="evntAdStatus"
                  value={formData.evntAdStatus}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  {editingAd ? 'Update Event Ad' : 'Create Event Ad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAds;
