import React from 'react';

const Awards = ({ t, resumeData, handleInputChange, handleAddSection, handleRemoveSection }) => {
    return (
        <div className="form-section">
            <h2 className="section-title">{t.awards}</h2>
            {resumeData.awards.map((award) => (
                <div key={award.id} className="item-container">
                    <div className="form-field">
                        <label htmlFor={`awardName-${award.id}`} className="form-label">{t.awardName}</label>
                        <input
                            id={`awardName-${award.id}`}
                            type="text"
                            name="name"
                            placeholder={t.awardNamePlaceholder}
                            value={award.name}
                            onChange={(e) => handleInputChange(e, 'awards', award.id)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor={`awardDate-${award.id}`} className="form-label">{t.awardDate}</label>
                        <input
                            id={`awardDate-${award.id}`}
                            type="date"
                            name="date"
                            placeholder={t.awardDatePlaceholder}
                            value={award.date}
                            onChange={(e) => handleInputChange(e, 'awards', award.id)}
                        />
                    </div>
                    <button className="remove-button" onClick={() => handleRemoveSection('awards', award.id)}>{t.remove}</button>
                </div>
            ))}
            <button className="add-button" onClick={() => handleAddSection('awards', { name: '', date: '' })}>{t.addAward}</button>
        </div>
    );
};

export default Awards;