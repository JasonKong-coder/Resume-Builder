import React from 'react';

const Volunteering = ({ t, resumeData, handleInputChange, handleAddSection, handleRemoveSection }) => {
    return (
        <div className="form-section">
            <h2 className="section-title">{t.volunteering}</h2>
            {resumeData.volunteering.map((vol) => (
                <div key={vol.id} className="item-container">
                    <div className="form-field">
                        <label htmlFor={`organization-${vol.id}`} className="form-label">{t.organization}</label>
                        <input
                            id={`organization-${vol.id}`}
                            type="text"
                            name="organization"
                            placeholder={t.organizationPlaceholder}
                            value={vol.organization}
                            onChange={(e) => handleInputChange(e, 'volunteering', vol.id)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor={`role-${vol.id}`} className="form-label">{t.role}</label>
                        <input
                            id={`role-${vol.id}`}
                            type="text"
                            name="role"
                            placeholder={t.rolePlaceholder}
                            value={vol.role}
                            onChange={(e) => handleInputChange(e, 'volunteering', vol.id)}
                        />
                    </div>
                    <button className="remove-button" onClick={() => handleRemoveSection('volunteering', vol.id)}>{t.remove}</button>
                </div>
            ))}
            <button className="add-button" onClick={() => handleAddSection('volunteering', { organization: '', role: '' })}>{t.addVolunteering}</button>
        </div>
    );
};

export default Volunteering;