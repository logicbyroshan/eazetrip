import { useState } from 'react';
import { X, Star, Upload, Trash2, Camera, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ReviewSubmitModal({
  serviceType = 'Flight',
  serviceId,
  serviceName = 'Travel Service',
  onClose,
  onReviewSubmitted
}) {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 4) {
      setError('You can upload a maximum of 4 photos per review.');
      return;
    }
    setError('');

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Please select valid image files (JPG, PNG, WebP).');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be under 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide feedback about your travel experience.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        serviceType,
        serviceId: String(serviceId),
        userId: user?.id || 'USR-ANON',
        userName: reviewerName.trim() || user?.name || 'Verified Traveler',
        rating: Number(rating),
        comment: comment.trim(),
        photos
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        if (onReviewSubmitted) onReviewSubmitted(data.data);
        onClose();
      } else {
        setError(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      setError('Network error while submitting review. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container review-submit-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        <div className="modal-header-custom">
          <div>
            <h3 id="review-modal-title">Write a Verified Review</h3>
            <span className="sub-tagline">{serviceType}: {serviceName}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close review modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-modal-body">
          {error && <div className="review-error-banner">{error}</div>}

          {/* Rating Stars Selector */}
          <div className="rating-select-block">
            <label className="field-label">Overall Rating *</label>
            <div className="star-picker-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="star-btn"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={28}
                    className={(hoverRating || rating) >= star ? 'star-filled' : 'star-empty'}
                  />
                </button>
              ))}
              <span className="rating-rating-label">
                {rating === 5 && '🌟 Exceptional / Loved it!'}
                {rating === 4 && '👍 Very Good / Recommended'}
                {rating === 3 && '👌 Average Experience'}
                {rating === 2 && '👎 Below Expectations'}
                {rating === 1 && '⚠️ Poor Experience'}
              </span>
            </div>
          </div>

          {/* Name Field */}
          <div className="form-group">
            <label className="field-label">Your Name</label>
            <input
              type="text"
              placeholder="e.g. Ananya Birla"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="text-input"
            />
            {isAuthenticated && (
              <span className="verified-badge-hint">
                <ShieldCheck size={14} color="#10b981" /> Verified EazeTrip Traveler Account
              </span>
            )}
          </div>

          {/* Comment Field */}
          <div className="form-group">
            <label className="field-label">Detailed Review & Tips for Fellow Travelers *</label>
            <textarea
              rows={4}
              placeholder="Share details about punctuality, legroom, staff service, cleanliness, or luggage handling..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-input"
              required
            />
          </div>

          {/* Photo Upload Dropzone */}
          <div className="form-group">
            <label className="field-label">Trip Photos (Optional - Max 4)</label>
            <div className="photo-upload-grid">
              {photos.map((src, index) => (
                <div key={index} className="photo-preview-box">
                  <img src={src} alt={`Upload ${index + 1}`} />
                  <button
                    type="button"
                    className="photo-remove-btn"
                    onClick={() => handleRemovePhoto(index)}
                    title="Remove photo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              {photos.length < 4 && (
                <label className="photo-upload-dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <Camera size={22} color="#034ea2" />
                  <span>Upload Photos</span>
                </label>
              )}
            </div>
          </div>

          <div className="modal-footer-custom">
            <button type="button" className="modal-dismiss-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="modal-book-cta-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting Review...' : 'Submit Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
