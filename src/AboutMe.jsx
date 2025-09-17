import React from 'react';

const AboutMe = ({ t, resumeData, handlePersonalInfoChange }) => {
    return (
        <div className="form-section">
            <h2 className="section-title">{t.aboutMe}</h2>
            <label htmlFor="aboutMe" className="form-label">{t.aboutMe}</label>
            <textarea
                id="aboutMe"
                name="aboutMe"
                placeholder={t.aboutMePlaceholder}
                value={resumeData.aboutMe}
                onChange={handlePersonalInfoChange}
                rows="4"
            />
        </div>
    );
};

export default AboutMe;