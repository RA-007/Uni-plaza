import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { otherAdsAPI } from './services/api';
import DynamicInput from './components/DynamicInput';
import FileUpload from './components/FileUpload';
import styles from './ClubDashboard.module.css';

const OtherAds = () => {
  const [otherAds, setOtherAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    otherAdTitle: '',
    otherAdDate: '',
    otherAdDescription: '',
    university: '',
    contactNumber: [''],
    otherAdLocation: '',
    otherAdImage: [],
    otherAdTags: [''],
    otherAdRelatedLinks: [''],
    otherAdStatus: 'active'
  });

  useEffect(() => {
    fetchOtherAds();
  }, []);

  const fetchOtherAds = async () => {
    try {
      setLoading(true);
      const response = await otherAdsAPI.getAll();
      setOtherAds(response.data);
    } catch (error) {
      console.error('Error fetching other ads:', error);
      setOtherAds([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.otherAdTitle.trim()) {
      newErrors.otherAdTitle = 'Ad title is required';
    }
    if (!formData.otherAdDescription.trim()) {
      newErrors.otherAdDescription = 'Ad description is required';
    }
    if (!formData.university.trim()) {
      newErrors.university = 'University name is required';
    }
    if (formData.contactNumber.filter(num => num.trim()).length === 0) {
      newErrors.contactNumber = 'At least one contact number is required';
    }
    if (formData.otherAdTags.filter(tag => tag.trim()).length === 0) {
      newErrors.otherAdTags = 'At least one tag is required';
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
        otherAdTags: formData.otherAdTags.filter(tag => tag.trim()),
        otherAdRelatedLinks: formData.otherAdRelatedLinks.filter(link => link.trim()),
      };

      if (editingAd) {
        await otherAdsAPI.update(editingAd._id, submitData);
      } else {
        await otherAdsAPI.create(submitData);
      }

      setShowModal(false);
      setEditingAd(null);
      resetForm();
      fetchOtherAds();
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: editingAd ? 'Other ad updated successfully!' : 'Other ad created successfully!',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      console.error('Error saving other ad:', error);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'Error saving other ad. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      otherAdTitle: ad.otherAdTitle || '',
      otherAdDate: ad.otherAdDate ? ad.otherAdDate.split('T')[0] : '',
      otherAdDescription: ad.otherAdDescription || '',
      university: ad.university || '',
      contactNumber: ad.contactNumber && ad.contactNumber.length > 0 ? ad.contactNumber : [''],
      otherAdLocation: ad.otherAdLocation || '',
      otherAdImage: ad.otherAdImage || [],
      otherAdTags: ad.otherAdTags && ad.otherAdTags.length > 0 ? ad.otherAdTags : [''],
      otherAdRelatedLinks: ad.otherAdRelatedLinks && ad.otherAdRelatedLinks.length > 0 ? ad.otherAdRelatedLinks : [''],
      otherAdStatus: ad.otherAdStatus || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this ad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await otherAdsAPI.delete(id);
        fetchOtherAds();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The ad has been deleted.',
          confirmButtonColor: '#3085d6'
        });
      } catch (error) {
        console.error('Error deleting other ad:', error);
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Error deleting other ad. Please try again.',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      otherAdTitle: '',
      otherAdDate: '',
      otherAdDescription: '',
      university: '',
      contactNumber: [''],
      otherAdLocation: '',
      otherAdImage: [],
      otherAdTags: [''],
      otherAdRelatedLinks: [''],
      otherAdStatus: 'active'
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

  const filteredAds = otherAds.filter(ad =>
    ad.otherAdTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.otherAdTags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingAd(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <div className={styles.loading}>Loading other ads...</div>;
  }

  return (
    <div>
      <div className={styles.actionsSection}>
        <button onClick={openAddModal} className={styles.addButton}>
          Add New Other Ad
        </button>
        <input
          type="text"
          placeholder="Search other ads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
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
                No other ads found
              </td>
            </tr>
          ) : (
            filteredAds.map((ad) => (
              <tr key={ad._id}>
                <td>{ad.otherAdTitle}</td>
                <td>
                  {ad.otherAdDate && new Date(ad.otherAdDate).toLocaleDateString()}
                </td>
                <td>{ad.university}</td>
                <td>{ad.otherAdLocation || 'N/A'}</td>
                <td>
                  <div className={styles.tags}>
                    {ad.otherAdTags?.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[`status${ad.otherAdStatus === 'active' ? 'Active' : 'Inactive'}`]}`}>
                    {ad.otherAdStatus}
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
                {editingAd ? 'Edit Other Ad' : 'Add New Other Ad'}
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
                    Ad Title <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="otherAdTitle"
                    value={formData.otherAdTitle}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.otherAdTitle ? styles.error : ''}`}
                    placeholder="Enter ad title"
                  />
                  {errors.otherAdTitle && (
                    <div className={styles.errorMessage}>{errors.otherAdTitle}</div>
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
                    Ad Date
                  </label>
                  <input
                    type="date"
                    name="otherAdDate"
                    value={formData.otherAdDate}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Location
                  </label>
                  <input
                    type="text"
                    name="otherAdLocation"
                    value={formData.otherAdLocation}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Ad Description <span style={{ color: '#d32f2f' }}>*</span>
                </label>
                <textarea
                  name="otherAdDescription"
                  value={formData.otherAdDescription}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${errors.otherAdDescription ? styles.error : ''}`}
                  placeholder="Enter ad description"
                  rows="4"
                />
                {errors.otherAdDescription && (
                  <div className={styles.errorMessage}>{errors.otherAdDescription}</div>
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
                label="Ad Tags"
                items={formData.otherAdTags}
                onItemsChange={(items) => setFormData(prev => ({ ...prev, otherAdTags: items }))}
                placeholder="Enter ad tag"
                required={true}
              />
              {errors.otherAdTags && (
                <div className={styles.errorMessage}>{errors.otherAdTags}</div>
              )}

              <DynamicInput
                label="Related Links"
                items={formData.otherAdRelatedLinks}
                onItemsChange={(items) => setFormData(prev => ({ ...prev, otherAdRelatedLinks: items }))}
                placeholder="Enter related link URL"
                required={false}
              />

              <FileUpload
                label="Ad Images"
                files={formData.otherAdImage}
                onFilesChange={(files) => setFormData(prev => ({ ...prev, otherAdImage: files }))}
                accept="image/*"
                multiple={true}
              />

              <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <select
                  name="otherAdStatus"
                  value={formData.otherAdStatus}
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
                  {editingAd ? 'Update Other Ad' : 'Create Other Ad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherAds;
