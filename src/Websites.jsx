import React from 'react';

const Websites = ({ t, resumeData, handleInputChange, handleAddSection, handleRemoveSection }) => {
    return (
        <div className="form-section">
            <h2 className="section-title">{t.websites}</h2>
            {resumeData.website.map((site) => (
                <div key={site.id} className="item-container">
                    <div className="form-field">
                        <label htmlFor={`websiteName-${site.id}`} className="form-label">{t.websiteName}</label>
                        <input
                            id={`websiteName-${site.id}`}
                            type="text"
                            name="name"
                            placeholder={t.websiteNamePlaceholder}
                            value={site.name}
                            onChange={(e) => handleInputChange(e, 'website', site.id)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor={`websiteUrl-${site.id}`} className="form-label">{t.websiteURL}</label>
                        <input
                            id={`websiteUrl-${site.id}`}
                            type="url"
                            name="url"
                            placeholder={t.websiteURLPlaceholder}
                            value={site.url}
                            onChange={(e) => handleInputChange(e, 'website', site.id)}
                        />
                    </div>
                    <button className="remove-button" onClick={() => handleRemoveSection('website', site.id)}>{t.remove}</button>
                </div>
            ))}
            <button className="add-button" onClick={() => handleAddSection('website', { name: '', url: '' })}>{t.addWebsite}</button>
        </div>
    );
};

export default Websites;