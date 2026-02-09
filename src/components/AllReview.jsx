import React, { useEffect, useState } from "react";
import "../assets/styles/DriverReview.css";
import { db } from "../firebase/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function AllReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRating, setFilterRating] = useState("all");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const q = query(collection(db, "driver-reviews"), orderBy("timestamp", "desc"));
                const querySnapshot = await getDocs(q);
                const fetchedReviews = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    // Filter reviews based on search and rating
    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = filterRating === "all" || review.rating?.toString() === filterRating;
        return matchesSearch && matchesRating;
    });

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
        : 0;

    if (loading) {
        return (
            <div className="reviews-container">
                <div className="reviews-card">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading reviews...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reviews-container">
            <div className="reviews-card">
                <div className="reviews-header">
                    <h1>All Driver Reviews</h1>
                    <div className="reviews-stats">
                        <div className="stat-card">
                            <span className="stat-number">{reviews.length}</span>
                            <span className="stat-label">Total Reviews</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{averageRating}</span>
                            <span className="stat-label">Average Rating</span>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by driver name or comment..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon">🔍</span>
                    </div>

                    <div className="rating-filter">
                        <label>Filter by rating:</label>
                        <select
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">⭐ 5 Stars</option>
                            <option value="4">⭐ 4 Stars</option>
                            <option value="3">⭐ 3 Stars</option>
                            <option value="2">⭐ 2 Stars</option>
                            <option value="1">⭐ 1 Star</option>
                        </select>
                    </div>
                </div>

                <hr className="divider" />

                {/* Reviews List */}
                <div className="reviews-list">
                    {filteredReviews.length > 0 ? (
                        <div className="reviews-grid">
                            {filteredReviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    <div className="review-header">
                                        <div className="driver-info">
                                            <h3 className="driver-name">{review.driverName}</h3>
                                            <div className="rating-stars">
                                                {[...Array(5)].map((_, index) => (
                                                    <span
                                                        key={index}
                                                        className={`star ${index < review.rating ? 'filled' : ''}`}
                                                    >
                                                        ⭐
                                                    </span>
                                                ))}
                                                <span className="rating-text">({review.rating}/5)</span>
                                            </div>
                                        </div>
                                        <div className="review-meta">
                                            <span className="timestamp">
                                                {review.timestamp?.toDate
                                                    ? review.timestamp.toDate().toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : 'Date not available'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="review-comment">
                                        <p>"{review.comment}"</p>
                                    </div>

                                    {review.userEmail && (
                                        <div className="reviewer-info">
                                            <small>Reviewed by: {review.userEmail}</small>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-reviews">
                            <div className="no-reviews-icon">📝</div>
                            <h3>No reviews found</h3>
                            <p>
                                {searchTerm || filterRating !== "all"
                                    ? "Try adjusting your search or filter criteria."
                                    : "No reviews have been submitted yet."
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                {filteredReviews.length > 0 && (
                    <div className="results-count">
                        Showing {filteredReviews.length} of {reviews.length} reviews
                    </div>
                )}
            </div>
        </div>
    );
}