import React from 'react';

const Education = ({ t, resumeData, handleInputChange, handleAddSection, handleRemoveSection }) => {
    return (
        <div className="form-section">
            <h2 className="section-title">{t.education}</h2>
            {resumeData.education.map((edu) => (
                <div key={edu.id} className="item-container">
                    <div className="form-field">
                        <label htmlFor={`institution-${edu.id}`} className="form-label">{t.institution}</label>
                        <input
                            id={`institution-${edu.id}`}
                            type="text"
                            name="institution"
                            placeholder={t.institutionPlaceholder}
                            value={edu.institution}
                            onChange={(e) => handleInputChange(e, 'education', edu.id)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor={`qualification-${edu.id}`} className="form-label">{t.qualification}</label>
                        <input
                            id={`qualification-${edu.id}`}
                            type="text"
                            name="qualification"
                            placeholder={t.qualificationPlaceholder}
                            value={edu.qualification}
                            onChange={(e) => handleInputChange(e, 'education', edu.id)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor={`graduationDate-${edu.id}`} className="form-label">{t.graduationDate}</label>
                        <input
                            id={`graduationDate-${edu.id}`}
                            type="date"
                            name="graduationDate"
                            placeholder={t.graduationDatePlaceholder}
                            value={edu.graduationDate}
                            onChange={(e) => handleInputChange(e, 'education', edu.id)}
                        />
                    </div>
                    <div className="form-field url-input">
                        <label htmlFor={`url-${edu.id}`} className="form-label">{t.websiteURL}</label>
                        <input
                            id={`url-${edu.id}`}
                            type="url"
                            name="url"
                            placeholder={t.websiteURLPlaceholder}
                            value={edu.url}
                            onChange={(e) => handleInputChange(e, 'education', edu.id)}
                            className="new-input"
                        />
                    </div>
                    <button className="remove-button" onClick={() => handleRemoveSection('education', edu.id)}>{t.remove}</button>
                </div>
            ))}
            <button className="add-button" onClick={() => handleAddSection('education', { institution: '', qualification: '', graduationDate: '', url: '' })}>{t.addEducation}</button>
        </div>
    );
};

export default Education;