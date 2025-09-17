import React from 'react';

const WorkExperience = ({ t, resumeData, handleInputChange, handleAddSection, handleRemoveSection }) => {
  return (
    <div className='form-section'>
      <h2 className='section-title'>{t.workExperience}</h2>
      {resumeData.workExperience.map((job) => (
        <div key={job.id} className='form-group'>
          <div className='input-row'>
            <label htmlFor={`company-${job.id}`} className="form-label">{t.company}</label>
            <input
              id={`company-${job.id}`}
              type="text"
              name="company"
              placeholder={t.companyPlaceholder}
              value={job.company}
              onChange={(e) => handleInputChange(e, 'workExperience', job.id)}
            />
            <label htmlFor={`position-${job.id}`} className="form-label">{t.position}</label>
            <input
              id={`position-${job.id}`}
              type="text"
              name="position"
              placeholder={t.positionPlaceholder}
              value={job.position}
              onChange={(e) => handleInputChange(e, 'workExperience', job.id)}
            />
          </div>
          <div className='input-row'>
            <label htmlFor={`startDate-${job.id}`} className="form-label">{t.startDate}</label>
            <input
              id={`startDate-${job.id}`}
              type="date"
              name="startDate"
              placeholder={t.startDatePlaceholder}
              value={job.startDate}
              onChange={(e) => handleInputChange(e, 'workExperience', job.id)}
            />
            <label htmlFor={`endDate-${job.id}`} className="form-label">{t.endDate}</label>
            <input
              id={`endDate-${job.id}`}
              type="date"
              name="endDate"
              placeholder={t.endDatePlaceholder}
              value={job.endDate}
              onChange={(e) => handleInputChange(e, 'workExperience', job.id)}
            />
          </div>
          <label htmlFor={`responsibilities-${job.id}`} className="form-label">{t.responsibilities}</label>
          <textarea
            id={`responsibilities-${job.id}`}
            className='input-field' 
            name="responsibilities"
            placeholder={t.responsibilitiesPlaceholder}
            value={job.responsibilities}
            onChange={(e) => handleInputChange(e, 'workExperience', job.id)}
          />
          <button type="button" onClick={() => handleRemoveSection('workExperience', job.id)} className='remove-button'>
            {t.remove}
          </button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddSection('workExperience', { id: '', company: '', position: '', startDate: '', endDate: '', responsibilities: '' })} className='add-button'>
        {t.addWorkExperience}
      </button>
    </div>
  );
};

export default WorkExperience;