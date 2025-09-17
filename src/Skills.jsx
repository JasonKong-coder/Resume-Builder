import React from 'react';

const Skills = ({ t, resumeData, handleInputChange, handleAddSection, handleRemoveSection }) => {
  const skills = resumeData.skills;

  return (
    <div className='form-section'>
      <h2 className='section-title'>{t.skills}</h2>
      {skills.map((skill) => (
        <div key={skill.id} className='form-group'>
          <div className='input-row'>
            <label htmlFor={`skillName-${skill.id}`} className="form-label">{t.skillName}</label>
            <input
              id={`skillName-${skill.id}`}
              type="text"
              name="name"
              placeholder={t.skillNamePlaceholder}
              value={skill.name}
              onChange={(e) => handleInputChange(e, 'skills', skill.id)}
            />
            <label htmlFor={`proficiency-${skill.id}`} className="form-label">{t.proficiency}</label>
            <select
              id={`proficiency-${skill.id}`}
              name="proficiency"
              value={skill.proficiency}
              onChange={(e) => handleInputChange(e, 'skills', skill.id)}
            >
              <option value="">{t.selectProficiency}</option>
              <option value="Beginner">{t.beginner}</option>
              <option value="Intermediate">{t.intermediate}</option>
              <option value="Expert">{t.expert}</option>
            </select>
          </div>
          <button type="button" onClick={() => handleRemoveSection('skills', skill.id)} className='remove-button'>
            {t.remove}
          </button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddSection('skills', { name: '', proficiency: '' })} className='add-button'>
        {t.addSkill}
      </button>
    </div>
  );
};

export default Skills;