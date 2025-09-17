import React from 'react';

const Languages = ({ t, resumeData, handleInputChange, handleAddSection, handleRemoveSection }) => {
  const languages = resumeData.languages;

  return (
    <div className='form-section'>
      <h2 className='section-title'>{t.languages}</h2>
      {languages.map((lang) => (
        <div key={lang.id} className='form-group'>
          <div className='input-row'>
            <label htmlFor={`languageName-${lang.id}`} className="form-label">{t.languageName}</label>
            <input
              id={`languageName-${lang.id}`}
              type="text"
              name="name"
              placeholder={t.languageNamePlaceholder}
              value={lang.name}
              onChange={(e) => handleInputChange(e, 'languages', lang.id)}
            />
            <label htmlFor={`proficiency-${lang.id}`} className="form-label">{t.proficiency}</label>
            <select
              id={`proficiency-${lang.id}`}
              name="proficiency"
              value={lang.proficiency}
              onChange={(e) => handleInputChange(e, 'languages', lang.id)}
            >
              <option value="">{t.selectProficiency}</option>
              <option value="Beginner">{t.beginner}</option>
              <option value="Intermediate">{t.intermediate}</option>
              <option value="Expert">{t.expert}</option>
            </select>
          </div>
          <button type="button" onClick={() => handleRemoveSection('languages', lang.id)} className='remove-button'>
            {t.remove}
          </button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddSection('languages', { name: '', proficiency: '' })} className='add-button'>
        {t.addLanguage}
      </button>
    </div>
  );
};

export default Languages;