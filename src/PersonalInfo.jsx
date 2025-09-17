import React from 'react';

const PersonalInfo = ({ t, resumeData, handlePersonalInfoChange, handleAvatarChange }) => {
  return (
    <div className='form-section'>
      <h2 className='section-title'>{t.personalInfo}</h2>
      <div className='form-group'>
        {/* 头像上传功能 */}
        <div className='avatar-upload'>
          {resumeData.avatar ? (
            <div className='avatar-preview-container'>
              <img src={resumeData.avatar} alt="Avatar" className="avatar-preview" />
              <button onClick={() => handleAvatarChange({ target: { files: [] } })} className="remove-avatar-button">X</button>
            </div>
          ) : (
            <label htmlFor="avatar-upload" className="avatar-placeholder">
              <span>+ {t.uploadAvatar}</span>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>
        
        <label htmlFor="name" className="form-label">{t.name}</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder={t.namePlaceholder}
          value={resumeData.name}
          onChange={handlePersonalInfoChange}
        />
        
        <label htmlFor="email" className="form-label">{t.email}</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder={t.emailPlaceholder}
          value={resumeData.email}
          onChange={handlePersonalInfoChange}
        />
        
        <label htmlFor="phone" className="form-label">{t.phone}</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder={t.phonePlaceholder}
          value={resumeData.phone}
          onChange={handlePersonalInfoChange}
        />
      </div>
    </div>
  );
};

export default PersonalInfo;