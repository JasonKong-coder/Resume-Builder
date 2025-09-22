import React from 'react';

const Projects = ({ t, resumeData, handleInputChange, handleAddSection, handleRemoveSection }) => {
    return (
        <div className="form-section">
            <h2 className="section-title">{t.projects}</h2>
            {resumeData.projects.map((proj) => (
                <div key={proj.id} className="item-container">
                    <div className="form-field">
                        <label htmlFor={`projectTitle-${proj.id}`} className="form-label">{t.projectTitle}</label>
                        <input
                            id={`projectTitle-${proj.id}`}
                            type="text"
                            name="title"
                            placeholder={t.projectTitlePlaceholder}
                            value={proj.title}
                            onChange={(e) => handleInputChange(e, 'projects', proj.id)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor={`projectURL-${proj.id}`} className="form-label">{t.projectURL}</label>
                        <input
                            id={`projectURL-${proj.id}`}
                            type="url"
                            name="url"
                            placeholder={t.projectURLPlaceholder}
                            value={proj.url}
                            onChange={(e) => handleInputChange(e, 'projects', proj.id)}
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor={`projectDescription-${proj.id}`} className="form-label">{t.projectDescription}</label>
                        <textarea
                            id={`projectDescription-${proj.id}`}
                            name="description"
                            placeholder={t.projectDescriptionPlaceholder}
                            value={proj.description}
                            onChange={(e) => handleInputChange(e, 'projects', proj.id)}
                            rows="3"
                        />
                    </div>
                    <button className="remove-button" onClick={() => handleRemoveSection('projects', proj.id)}>{t.remove}</button>
                </div>
            ))}
            <button className="add-button" onClick={() => handleAddSection('projects', { title: '', description: '',  url: ''  })}>{t.addProject}</button>
        </div>
    );
};

export default Projects;