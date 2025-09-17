import React from 'react';

const Certificate = ({ t, resumeData, handleInputChange, handleAddSection, handleRemoveSection }) => {
    return (
        <div className="form-section">
            <h2 className="section-title">{t.certificate}</h2>
            {resumeData.certificate.map((cert) => (
                <div key={cert.id} className="item-container">
                    <div className="form-field">
                        <label htmlFor={`certificateName-${cert.id}`} className="form-label">{t.certificateName}</label>
                        <input
                            id={`certificateName-${cert.id}`}
                            type="text"
                            name="name"
                            placeholder={t.certificateNamePlaceholder}
                            value={cert.name}
                            onChange={(e) => handleInputChange(e, 'certificate', cert.id)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor={`certificateDate-${cert.id}`} className="form-label">{t.date}</label>
                        <input
                            id={`certificateDate-${cert.id}`}
                            type="date"
                            name="date"
                            placeholder={t.datePlaceholder}
                            value={cert.date}
                            onChange={(e) => handleInputChange(e, 'certificate', cert.id)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor={`certificateUrl-${cert.id}`} className="form-label">{t.websiteURL}</label>
                        <input
                            id={`certificateUrl-${cert.id}`}
                            type="url"
                            name="url"
                            placeholder={t.websiteURLPlaceholder}
                            value={cert.url}
                            onChange={(e) => handleInputChange(e, 'certificate', cert.id)}
                            className="new-input"
                        />
                    </div>
                    <button className="remove-button" onClick={() => handleRemoveSection('certificate', cert.id)}>{t.remove}</button>
                </div>
            ))}
            <button className="add-button" onClick={() => handleAddSection('certificate', { name: '', date: '', url: '' })}>{t.addCertificate}</button>
        </div>
    );
};

export default Certificate;