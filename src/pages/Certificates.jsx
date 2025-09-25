// src/pages/Certificates.jsx 
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { courseAPI } from "../api/courses";
import "./Certificates.css"; 

const Certificates = () => {
  const { currentUser } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [eligibleCourses, setEligibleCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCertificates();
    fetchEligibleCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await courseAPI.getUserCertificates();
      setCertificates(data);
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
      setError("Failed to fetch certificates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleCertificates = async () => {
    try {
      const myCourses = await courseAPI.getMyCourses();
      const eligible = [];
      for (const course of myCourses) {
        try {
          const eligibility = await courseAPI.checkCertificateEligibility(course.id);
          if (eligibility.eligible) eligible.push(course);
        } catch (err) {
          console.warn(`Eligibility check failed for ${course.id}`, err);
        }
      }
      setEligibleCourses(eligible);
    } catch (err) {
      console.error("Failed to fetch eligible courses:", err);
    }
  };

  const handleClaim = async (courseId) => {
    try {
      await courseAPI.claimCertificate(courseId);
      await fetchCertificates();
      await fetchEligibleCertificates();
    } catch (err) {
      console.error("Claim failed:", err);
      setError("Failed to claim certificate. Please try again.");
    }
  };

  const handleDownload = async (certificateHash) => {
    try {
      const response = await courseAPI.downloadCertificate(certificateHash);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${certificateHash}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download certificate. Please try again.");
    }
  };

  const handleVerify = (certificateHash) => {
    window.open(`/certificates/${certificateHash}/verify`, "_blank");
  };

  return (
    <div className="certificates-container">
      <div className="certificates-content">
        {/* Header */}
        <div className="certificates-header">
          <h1 className="certificates-title">
            My Certificates
          </h1>
          <p className="certificates-subtitle">
            Celebrate your achievements and showcase your completed courses
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="text-gray-500">Loading your certificates...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-container">
            <p>{error}</p>
            <button
              onClick={fetchCertificates}
              className="error-button"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Eligible Certificates */}
        {eligibleCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="section-title">
              Eligible Certificates
            </h2>
            <div className="courses-grid">
              {eligibleCourses.map((course) => (
                <div
                  key={course.id}
                  className="course-card"
                >
                  <h3 className="course-title">
                    {course.title}
                  </h3>
                  <button
                    onClick={() => handleClaim(course.id)}
                    className="claim-button"
                  >
                    <i className="fas fa-certificate mr-2"></i> Claim Certificate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Certificates */}
        {!loading && certificates.length === 0 && (
          <div className="empty-state">
            <i className="empty-icon fas fa-certificate"></i>
            <h2 className="empty-title">
              No certificates yet
            </h2>
            <p className="empty-description">
              Complete courses to earn certificates that showcase your skills.
            </p>
            <a
              href="/courses"
              className="browse-button"
            >
              Browse Courses
            </a>
          </div>
        )}

        {/* Certificates Grid */}
        {certificates.length > 0 && (
          <div>
            <h2 className="section-title">
              Earned Certificates
            </h2>
            <div className="certificate-grid">
              {certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="certificate-card"
                >
                  {/* Header */}
                  <div className="certificate-header">
                    <i className="certificate-icon fas fa-award"></i>
                    <div className="certificate-meta">
                      <p>
                        Issued:{" "}
                        {new Date(certificate.issued_at).toLocaleDateString()}
                      </p>
                      <p>
                        ID: {certificate.certificate_hash.substring(0, 8)}...
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="certificate-body">
                    <h3 className="certificate-course-title">
                      {certificate.course_title}
                    </h3>
                    <p className="text-gray-500">This certifies that</p>
                    <h4 className="certificate-user-name">
                      {currentUser.full_name}
                    </h4>
                    <p className="text-gray-500">
                      has successfully completed the course requirements
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="certificate-actions">
                    <button
                      onClick={() =>
                        handleDownload(certificate.certificate_hash)
                      }
                      className="action-button download-button"
                    >
                      <i className="fas fa-download"></i> Download
                    </button>
                    <button
                      onClick={() => handleVerify(certificate.certificate_hash)}
                      className="action-button verify-button"
                    >
                      <i className="fas fa-shield-alt"></i> Verify
                    </button>
                    {certificate.download_url && (
                      <a
                        href={certificate.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button view-button"
                      >
                        <i className="fas fa-eye"></i> View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;