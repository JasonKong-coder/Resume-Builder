import React from 'react';

// 确保你接收了正确的 prop
const AboutMe = ({ t, resumeData, handleAboutMeChange }) => {
    return (
        <div className="form-section">
            <h2 className="section-title">{t.aboutMe}</h2>
            <label htmlFor="aboutMe" className="form-label">{t.aboutMe}</label>
            <textarea
                id="aboutMe"
                name="aboutMe"
                placeholder={t.aboutMePlaceholder}
                value={resumeData.aboutMe}
                onChange={handleAboutMeChange} // 使用正确的函数
                rows="4"
            />
        </div>
    );
};

export default AboutMe;