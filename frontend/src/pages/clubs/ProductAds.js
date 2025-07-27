import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { productAdsAPI } from './services/api';
import DynamicInput from './components/DynamicInput';
import FileUpload from './components/FileUpload';
import styles from './ClubDashboard.module.css';

const ProductAds = () => {
  const [productAds, setProductAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    prodAdName: '',
    prodAdDescription: '',
    university: '',
    prodAdPrice: '',
    contactNumber: [''],
    prodAdImage: [],
    prodAdTags: [''],
    prodAdRelatedLinks: [''],
    prodAdStatus: 'active'
  });

  useEffect(() => {
    fetchProductAds();
  }, []);

  const fetchProductAds = async () => {
    try {
      setLoading(true);
      const response = await productAdsAPI.getAll();
      setProductAds(response.data);
    } catch (error) {
      console.error('Error fetching product ads:', error);
      setProductAds([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.prodAdName.trim()) {
      newErrors.prodAdName = 'Product name is required';
    }
    if (!formData.prodAdDescription.trim()) {
      newErrors.prodAdDescription = 'Product description is required';
    }
    if (!formData.university.trim()) {
      newErrors.university = 'University name is required';
    }
    if (!formData.prodAdPrice || formData.prodAdPrice <= 0) {
      newErrors.prodAdPrice = 'Product price must be greater than 0';
    }
    if (formData.contactNumber.filter(num => num.trim()).length === 0) {
      newErrors.contactNumber = 'At least one contact number is required';
    }
    if (formData.prodAdTags.filter(tag => tag.trim()).length === 0) {
      newErrors.prodAdTags = 'At least one tag is required';
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
        prodAdPrice: parseFloat(formData.prodAdPrice),
        contactNumber: formData.contactNumber.filter(num => num.trim()),
        prodAdTags: formData.prodAdTags.filter(tag => tag.trim()),
        prodAdRelatedLinks: formData.prodAdRelatedLinks.filter(link => link.trim()),
      };

      if (editingAd) {
        await productAdsAPI.update(editingAd._id, submitData);
      } else {
        await productAdsAPI.create(submitData);
      }

      setShowModal(false);
      setEditingAd(null);
      resetForm();
      fetchProductAds();
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: editingAd ? 'Product ad updated successfully!' : 'Product ad created successfully!',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      console.error('Error saving product ad:', error);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'Error saving product ad. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      prodAdName: ad.prodAdName || '',
      prodAdDescription: ad.prodAdDescription || '',
      university: ad.university || '',
      prodAdPrice: ad.prodAdPrice || '',
      contactNumber: ad.contactNumber && ad.contactNumber.length > 0 ? ad.contactNumber : [''],
      prodAdImage: ad.prodAdImage || [],
      prodAdTags: ad.prodAdTags && ad.prodAdTags.length > 0 ? ad.prodAdTags : [''],
      prodAdRelatedLinks: ad.prodAdRelatedLinks && ad.prodAdRelatedLinks.length > 0 ? ad.prodAdRelatedLinks : [''],
      prodAdStatus: ad.prodAdStatus || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this product ad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await productAdsAPI.delete(id);
        fetchProductAds();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The product ad has been deleted.',
          confirmButtonColor: '#3085d6'
        });
      } catch (error) {
        console.error('Error deleting product ad:', error);
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Error deleting product ad. Please try again.',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      prodAdName: '',
      prodAdDescription: '',
      university: '',
      prodAdPrice: '',
      contactNumber: [''],
      prodAdImage: [],
      prodAdTags: [''],
      prodAdRelatedLinks: [''],
      prodAdStatus: 'active'
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

  const filteredAds = productAds.filter(ad =>
    ad.prodAdName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.prodAdTags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingAd(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <div className={styles.loading}>Loading product ads...</div>;
  }

  return (
    <div>
      <div className={styles.actionsSection}>
        <button onClick={openAddModal} className={styles.addButton}>
          Add New Product Ad
        </button>
        <input
          type="text"
          placeholder="Search product ads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>University</th>
            <th>Tags</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAds.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.noData}>
                No product ads found
              </td>
            </tr>
          ) : (
            filteredAds.map((ad) => (
              <tr key={ad._id}>
                <td>{ad.prodAdName}</td>
                <td>${ad.prodAdPrice}</td>
                <td>{ad.university}</td>
                <td>
                  <div className={styles.tags}>
                    {ad.prodAdTags?.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[`status${ad.prodAdStatus === 'active' ? 'Active' : 'Inactive'}`]}`}>
                    {ad.prodAdStatus}
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
                {editingAd ? 'Edit Product Ad' : 'Add New Product Ad'}
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
                    Product Name <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="prodAdName"
                    value={formData.prodAdName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.prodAdName ? styles.error : ''}`}
                    placeholder="Enter product name"
                  />
                  {errors.prodAdName && (
                    <div className={styles.errorMessage}>{errors.prodAdName}</div>
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
                    Price <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="prodAdPrice"
                    value={formData.prodAdPrice}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.prodAdPrice ? styles.error : ''}`}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                  {errors.prodAdPrice && (
                    <div className={styles.errorMessage}>{errors.prodAdPrice}</div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Status</label>
                  <select
                    name="prodAdStatus"
                    value={formData.prodAdStatus}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Product Description <span style={{ color: '#d32f2f' }}>*</span>
                </label>
                <textarea
                  name="prodAdDescription"
                  value={formData.prodAdDescription}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${errors.prodAdDescription ? styles.error : ''}`}
                  placeholder="Enter product description"
                  rows="4"
                />
                {errors.prodAdDescription && (
                  <div className={styles.errorMessage}>{errors.prodAdDescription}</div>
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
                label="Product Tags"
                items={formData.prodAdTags}
                onItemsChange={(items) => setFormData(prev => ({ ...prev, prodAdTags: items }))}
                placeholder="Enter product tag"
                required={true}
              />
              {errors.prodAdTags && (
                <div className={styles.errorMessage}>{errors.prodAdTags}</div>
              )}

              <DynamicInput
                label="Related Links"
                items={formData.prodAdRelatedLinks}
                onItemsChange={(items) => setFormData(prev => ({ ...prev, prodAdRelatedLinks: items }))}
                placeholder="Enter related link URL"
                required={false}
              />

              <FileUpload
                label="Product Images"
                files={formData.prodAdImage}
                onFilesChange={(files) => setFormData(prev => ({ ...prev, prodAdImage: files }))}
                accept="image/*"
                multiple={true}
              />

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
                  {editingAd ? 'Update Product Ad' : 'Create Product Ad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAds;
