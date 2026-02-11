import { useState, useEffect } from 'react';
import { getAllReviews, replyToReview, deleteReview } from '../../api/reviewService.js';
import { useToast } from '../../contexts';
import { useConfirm } from '../../components/useConfirm';
import StarRating from '../../components/StarRating';
import Modal from '../../components/Modal';
import BackButton from '../../components/BackButton';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const toast = useToast();
  const confirm = useConfirm();

  const fetchReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReplyClick = (review) => {
    setReplyModal(review);
    setReplyText(review.admin_reply || '');
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setReplyLoading(true);
    try {
      await replyToReview(replyModal.id, replyText.trim());
      toast.success(replyText.trim() ? 'Reply saved!' : 'Reply removed!');
      setReplyModal(null);
      fetchReviews();
    } catch {
      toast.error('Failed to save reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Review?',
      message: 'This will permanently remove this review. This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Keep',
      variant: 'danger'
    });
    if (!ok) return;
    try {
      await deleteReview(id);
      toast.success('Review deleted!');
      fetchReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filters
  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'all' 
      || (filter === 'replied' && review.admin_reply)
      || (filter === 'unreplied' && !review.admin_reply)
      || (filter === 'high' && review.rating >= 4)
      || (filter === 'low' && review.rating <= 2);
    
    const matchesSearch = !search || 
      review.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      review.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      review.comment?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Stats
  const stats = {
    total: reviews.length,
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0',
    replied: reviews.filter(r => r.admin_reply).length,
    unreplied: reviews.filter(r => !r.admin_reply).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <BackButton to="/admin" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Customer Reviews</h1>
          <p className="text-gray-600 mt-1">View and respond to product reviews</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Reviews</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-amber-600">⭐ {stats.avgRating}</div>
            <div className="text-sm text-gray-500">Average Rating</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-green-600">{stats.replied}</div>
            <div className="text-sm text-gray-500">Replied</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-red-500">{stats.unreplied}</div>
            <div className="text-sm text-gray-500">Awaiting Reply</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user, product, or comment..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All' },
                { value: 'unreplied', label: 'Unreplied' },
                { value: 'replied', label: 'Replied' },
                { value: 'high', label: '4-5 ⭐' },
                { value: 'low', label: '1-2 ⭐' },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filter === f.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No reviews found</h3>
            <p className="text-gray-500">
              {search || filter !== 'all' ? 'Try adjusting your search or filter' : 'No reviews have been submitted yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                    {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800">{review.user?.name || 'Anonymous'}</h3>
                        <p className="text-sm text-gray-500 truncate">{review.user?.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StarRating rating={review.rating} size="small" />
                        <span className="text-xs sm:text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                      </div>
                    </div>

                    {/* Product */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 mb-3">
                      <span>{review.product?.emoji || '🌱'}</span>
                      <span>{review.product?.name || 'Unknown Product'}</span>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 mb-3">{review.comment || <span className="italic text-gray-400">No comment</span>}</p>

                    {/* Admin Reply */}
                    {review.admin_reply && (
                      <div className="ml-2 pl-3 border-l-2 border-green-300 bg-green-50 rounded-r-lg p-3 mb-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-semibold text-green-700">🌿 Your Reply</span>
                          {review.admin_reply_at && (
                            <span className="text-xs text-green-600">• {formatDate(review.admin_reply_at)}</span>
                          )}
                        </div>
                        <p className="text-sm text-green-800">{review.admin_reply}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleReplyClick(review)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                          review.admin_reply
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {review.admin_reply ? '✏️ Edit Reply' : '💬 Reply'}
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <Modal isOpen={true} onClose={() => setReplyModal(null)} size="default">
          <Modal.Header>
            <Modal.Title>{replyModal.admin_reply ? 'Edit Reply' : 'Reply to Review'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Review preview */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {replyModal.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">{replyModal.user?.name}</h4>
                  <div className="flex items-center gap-2">
                    <StarRating rating={replyModal.rating} size="small" />
                    <span className="text-xs text-gray-500">{formatDate(replyModal.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 ml-11">{replyModal.comment}</p>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="Write your response to this review..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{replyText.length}/1000</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReplyModal(null)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                {replyModal.admin_reply && (
                  <button
                    type="button"
                    onClick={() => { setReplyText(''); }}
                    className="py-3 px-4 bg-red-50 text-red-700 font-medium rounded-xl hover:bg-red-100 transition-colors"
                  >
                    Remove Reply
                  </button>
                )}
                <button
                  type="submit"
                  disabled={replyLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
                >
                  {replyLoading ? 'Saving...' : 'Save Reply'}
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
