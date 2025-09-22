import React, { useState,useRef,useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, Font, PDFDownloadLink, Image } from '@react-pdf/renderer';
import './App.css';
import { DndContext, closestCenter, useSensors, useSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import PersonalInfo from './PersonalInfo.jsx';
import Education from './Education.jsx';
import WorkExperience from './WorkExperience.jsx';
import Certificate from './Certificate.jsx';
import Skills from './Skills.jsx';
import Languages from './Languages.jsx';
import Websites from './Websites.jsx';
import AboutMe from './AboutMe.jsx';
import Projects from './Projects.jsx';
import Awards from './Awards.jsx';
import Volunteering from './Volunteering.jsx';
import DraggableSection from './DraggableSect.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

// 注册本地和网络字体，供 PDF 使用
Font.register({
  family: 'Noto Sans SC',
  src: '/Resume-Builder/fonts/NotoSansSC-VariableFont_wght.ttf'
});
Font.register({
  family: 'Noto Serif SC',
  src: '/Resume-Builder/fonts/NotoSerifSC-VariableFont_wght.ttf'
});
Font.register({
  family: 'ChironGoRoundTC',
  src: '/Resume-Builder/fonts/ChironGoRoundTC-VariableFont_wght.ttf'
});

// SafeText：只有在 children 有非空文本时才渲染 <Text>
const SafeText = ({ children, style }) => {
  if (children === null || children === undefined) return null;
  const s = String(children).trim();
  if (s === "") return null;
  return <Text style={style}>{s}</Text>;
};

// sanitizeForPdf：把 resumeData 深度清理，移除空字符串 / 空对象，保留最小安全结构
const sanitizeForPdf = (data) => {
  const clean = (v) => {
    if (v === null || v === undefined) return undefined;
    if (typeof v === "string") {
      const s = v.trim();
      return s === "" ? undefined : s;
    }
    if (Array.isArray(v)) {
      const arr = v
        .map((x) => clean(x))
        .filter((x) => {
          if (x === undefined) return false;
          if (typeof x === "object" && Object.keys(x).length === 0) return false;
          return true;
        });
      return arr;
    }
    if (typeof v === "object") {
      const obj = {};
      Object.entries(v).forEach(([k, val]) => {
        const c = clean(val);
        if (c !== undefined) obj[k] = c;
      });
      // 如果对象变成空对象，返回 undefined（上层会过滤掉）
      if (Object.keys(obj).length === 0) return undefined;
      return obj;
    }
    return v;
  };

  // 深拷贝并清理
  try {
    return clean(JSON.parse(JSON.stringify(data))) || {};
  } catch (e) {
    console.error("sanitizeForPdf failed", e);
    return data;
  }
};

const ResumeDocument = ({ resumeData, t, sectionOrder, theme, customColors }) => {
   const safeText = (value) => (value ? String(value) : "");
  const renderSection = (sectionName) => {
    const { personalInfo, workExperience, education, projects, certificate, awards, skills, languages, volunteering, website, aboutMe } = resumeData;
    const sections = {
      personalInfo:
        personalInfo &&
        (personalInfo.name || personalInfo.email || personalInfo.phone || personalInfo.avatar) && (
          <View style={styles.section} key="personalInfo">
            {personalInfo.avatar && (
              <Image style={styles.avatar} src={personalInfo.avatar} />
            )}
            <SafeText style={styles.name}>{safeText(personalInfo.name)}</SafeText>
            <SafeText style={styles.p}>Email: {safeText(personalInfo.email)}</SafeText>
            <SafeText style={styles.p}>Phone: {safeText(personalInfo.phone)}</SafeText>
          </View>
        ),

      aboutMe:
        aboutMe && aboutMe.trim() !== "" && (
          <View style={styles.section} key="aboutMe">
            <SafeText style={styles.h2}>{t.aboutMe}</SafeText>
            <SafeText style={styles.p}>{safeText(aboutMe)}</SafeText>
          </View>
        ),

      workExperience:
        workExperience.filter((job) => job && job.company && job.position).length > 0 && (
          <View style={styles.section} key="workExperience">
            <SafeText style={styles.h2}>{t.workExperience}</SafeText>
            {workExperience
              .filter((job) => job && job.company && job.position)
              .map((job) => (
                <View key={job.id} style={styles.itemContainer}>
                  <SafeText style={styles.h3}>
                    {safeText(job.position)} @ {safeText(job.company)}
                  </SafeText>
                  <SafeText style={styles.p}>
                    {safeText(job.startDate)} - {safeText(job.endDate)}
                  </SafeText>
                  <SafeText style={styles.p}>{safeText(job.responsibilities)}</SafeText>
                </View>
              ))}
          </View>
        ),

      education:
        education.filter((edu) => edu && edu.institution && edu.qualification).length > 0 && (
          <View style={styles.section} key="education">
            <SafeText style={styles.h2}>{t.education}</SafeText>
            {education
              .filter((edu) => edu && edu.institution && edu.qualification)
              .map((edu) => (
                <View key={edu.id} style={styles.itemContainer}>
                  <SafeText style={styles.h3}>
                    {safeText(edu.qualification)} @ {safeText(edu.institution)}
                  </SafeText>
                  <SafeText style={styles.p}>{safeText(edu.graduationDate)}</SafeText>
                </View>
              ))}
          </View>
        ),

      projects:
        projects.filter((proj) => proj && proj.title).length > 0 && (
          <View style={styles.section} key="projects">
            <SafeText style={styles.h2}>{t.projects}</SafeText>
            {projects
              .filter((proj) => proj && proj.title)
              .map((proj) => (
                <View key={proj.id} style={styles.itemContainer}>
                  <SafeText style={styles.h3}>{safeText(proj.title)}</SafeText>
                  <SafeText style={styles.p}>{safeText(proj.description)}</SafeText>
                </View>
              ))}
          </View>
        ),

      certificate:
        certificate.filter((cert) => cert && cert.name).length > 0 && (
          <View style={styles.section} key="certificate">
            <SafeText style={styles.h2}>{t.certificate}</SafeText>
            {certificate
              .filter((cert) => cert && cert.name)
              .map((cert) => (
                <View key={cert.id} style={styles.itemContainer}>
                  <SafeText style={styles.p}>
                    {safeText(cert.name)} - {safeText(cert.date)}
                  </SafeText>
                </View>
              ))}
          </View>
        ),

      awards:
        awards.filter((award) => award && award.name).length > 0 && (
          <View style={styles.section} key="awards">
            <SafeText style={styles.h2}>{t.awards}</SafeText>
            {awards
              .filter((award) => award && award.name)
              .map((award) => (
                <View key={award.id} style={styles.itemContainer}>
                  <SafeText style={styles.p}>
                    {safeText(award.name)} - {safeText(award.date)}
                  </SafeText>
                </View>
              ))}
          </View>
        ),

      skills:
        skills.filter((skill) => skill && skill.name).length > 0 && (
          <View style={styles.section} key="skills">
            <SafeText style={styles.h2}>{t.skills}</SafeText>
            <SafeText style={styles.p}>
              {skills.filter((s) => s && s.name).map((s) => safeText(s.name)).join(", ")}
            </SafeText>
          </View>
        ),

      languages:
        languages.filter((lang) => lang && lang.name).length > 0 && (
          <View style={styles.section} key="languages">
            <SafeText style={styles.h2}>{t.languages}</SafeText>
            <SafeText style={styles.p}>
              {languages
                .filter((lang) => lang && lang.name)
                .map((lang) => `${safeText(lang.name)} - ${safeText(lang.proficiency)}`)
                .join(", ")}
            </SafeText>
          </View>
        ),

      volunteering:
        volunteering.filter((vol) => vol && vol.organization && vol.role).length > 0 && (
          <View style={styles.section} key="volunteering">
            <SafeText style={styles.h2}>{t.volunteering}</SafeText>
            {volunteering
              .filter((vol) => vol && vol.organization && vol.role)
              .map((vol) => (
                <View key={vol.id} style={styles.itemContainer}>
                  <SafeText style={styles.h3}>
                    {safeText(vol.role)} @ {safeText(vol.organization)}
                  </SafeText>
                </View>
              ))}
          </View>
        ),

      website:
        website.filter((site) => site && (site.url || site.name)).length > 0 && (
          <View style={styles.section} key="websites">
            <SafeText style={styles.h2}>{t.websites}</SafeText>
            {website
              .filter((site) => site && (site.url || site.name))
              .map((site) => (
                <View key={site.id} style={styles.itemContainer}>
                  <SafeText style={styles.p}>
                    {safeText(site.name) || safeText(site.url)}
                  </SafeText>
                </View>
              ))}
          </View>
        ),
    };

    return sections[sectionName];
  };


  // 根据 theme 和 customColors 动态设置 PDF 样式
  let fontFamily = 'Noto Sans SC';
  let bgColor = '#ffffff';
  let textColor = '#333333';
  let borderColor = '#cccccc';
  if (theme === 'modern') {
    fontFamily = 'ChironGoRoundTC';
    bgColor = '#f7f9fc';
    textColor = '#1a2a4b';
    borderColor = '#a0c3d9';
  } else if (theme === 'minimalist') {
    fontFamily = 'Noto Serif SC';
    bgColor = '#fefefe';
    textColor = '#444444';
    borderColor = '#eeeeee';
  } else if (theme === 'custom') {
    fontFamily = 'Noto Sans SC';
    bgColor = customColors?.background || '#ffffff';
    textColor = customColors?.text || '#333333';
    borderColor = customColors?.border || '#cccccc';
  }
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: bgColor,
      padding: 40,
      fontFamily: fontFamily,
      color: textColor,
    },
    section: {
      marginBottom: 10,
      paddingBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    },
    avatar: {
      width: 120, // 和 preview 差不多
      height: 120,
      borderRadius: 60, // 一半高度，保持圆形
      objectFit: 'cover', // react-pdf 里用的是 `objectFit`
      borderWidth: 3,
      borderColor: '#007bff',
      marginBottom: 10,
      alignSelf: 'center',
},
    name: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 10,
      fontFamily: fontFamily,
      color: textColor,
    },
    h2: {
      fontSize: 18,
      marginBottom: 5,
      fontFamily: fontFamily,
      color: textColor,
    },
    h3: {
      fontSize: 14,
      marginBottom: 5,
      fontFamily: fontFamily,
      color: textColor,
    },
    p: {
      fontSize: 12,
      marginBottom: 2,
      fontFamily: fontFamily,
      color: textColor,
    },
    itemContainer: {
      marginBottom: 10,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {sectionOrder.map((sectionId) => renderSection(sectionId))}
      </Page>
    </Document>
  );
};


const App = () => {
  const resumeRef = useRef(null);
  const translations = {
  en: {
    title: 'Resume Builder',
    home: 'Home',
    more: 'More',
    personalInfo: 'Personal Information',
    name: 'Name',
    namePlaceholder: 'Enter your full name',
    email: 'Email',
    emailPlaceholder: 'example@email.com',
    phone: 'Phone',
    phonePlaceholder: '+65 1234 5678',
    aboutMe: 'About Me',
    aboutMePlaceholder: 'Write a brief summary about yourself...',
    workExperience: 'Work Experience',
    addWorkExperience: 'Add Work Experience',
    company: 'Company',
    companyPlaceholder: 'e.g. Google',
    position: 'Position',
    positionPlaceholder: 'e.g. Software Engineer',
    startDate: 'Start Date',
    startDatePlaceholder: 'Start Date',
    endDate: 'End Date',
    endDatePlaceholder: 'End Date',
    responsibilities: 'Responsibilities',
    responsibilitiesPlaceholder: 'Describe your key responsibilities and achievements',
    education: 'Education',
    addEducation: 'Add Education',
    institution: 'Institution',
    institutionPlaceholder: 'e.g. Harvard University',
    qualification: 'Qualification',
    qualificationPlaceholder: 'e.g. Bachelor of Science in Computer Science',
    graduationDate: 'Graduation Date',
    graduationDatePlaceholder: 'Graduation Date',
    certificate: 'Certificates',
    addCertificate: 'Add Certificate',
    certificateName: 'Certificate Name',
    certificateNamePlaceholder: 'e.g. AWS Certified Developer',
    date: 'Date',
    datePlaceholder: 'Date',
    skills: 'Skills',
    addSkill: 'Add Skill',
    skillName: 'Skill Name',
    skillNamePlaceholder: 'e.g. JavaScript, React',
    languages: 'Languages',
    addLanguage: 'Add Language',
    languageName: 'Language',
    languageNamePlaceholder: 'e.g. English',
    proficiency: 'Proficiency',
    selectProficiency: 'Select Proficiency',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    expert: 'Expert',
    websites: 'Websites & Portfolios',
    addWebsite: 'Add Website',
    websiteName: 'Website Name',
    websiteNamePlaceholder: 'e.g. My GitHub',
    websiteURL: 'URL',
    websiteURLPlaceholder: 'Website URL (Optional)',
    remove: 'Remove',
    resumePreview: 'Resume Preview',
    generatePdf: 'Generate PDF',
    loading: 'Loading...',
    uploadAvatar: 'Upload Avatar',
    avatar: 'Avatar',
    theme: 'Theme',
    theme1: 'Theme 1',
    theme2: 'Theme 2',
    theme3: 'Theme 3',
    customize: 'Customize',
    switchLanguage: '切换语言',
    customColors: 'Custom Colors',
    bgColor: 'Background',
    textColor: 'Text',
    borderColor: 'Border',
    projects: 'Projects',
    addProject: 'Add Project',
    projectTitle: 'Project Title',
    projectTitlePlaceholder: 'e.g. E-commerce Website',
    projectURL: 'URL',
    projectURLPlaceholder: 'Website URL (optional)',
    projectDescription: 'Description',
    projectDescriptionPlaceholder: 'Briefly describe your project',
    awards: 'Awards',
    addAward: 'Add Award',
    awardName: 'Award Name',
    awardNamePlaceholder: 'e.g. Best Developer Award',
    awardDate: 'Date',
    awardDatePlaceholder: 'Date',
    volunteering: 'Volunteering',
    addVolunteering: 'Add Volunteering',
    organization: 'Organization',
    organizationPlaceholder: 'e.g. Red Cross',
    role: 'Role',
    rolePlaceholder: 'e.g. Event Coordinator',
  },
  zh: {
    title: '简历生成器',
    home: '主页',
    more: '更多',
    personalInfo: '个人信息',
    name: '姓名',
    namePlaceholder: '请输入你的姓名',
    email: '邮箱',
    emailPlaceholder: '例如: example@email.com',
    phone: '电话',
    phonePlaceholder: '例如: +86 123-4567-8900',
    aboutMe: '个人简介',
    aboutMePlaceholder: '在这里简要介绍一下你自己...',
    workExperience: '工作经历',
    addWorkExperience: '添加工作经历',
    company: '公司',
    companyPlaceholder: '例如：谷歌',
    position: '职位',
    positionPlaceholder: '例如：软件工程师',
    startDate: '开始日期',
    startDatePlaceholder: '开始日期',
    endDate: '结束日期',
    endDatePlaceholder: '结束日期',
    responsibilities: '职责',
    responsibilitiesPlaceholder: '描述你的主要职责和成就',
    education: '教育背景',
    addEducation: '添加教育背景',
    institution: '学校',
    institutionPlaceholder: '例如：清华大学',
    qualification: '专业',
    qualificationPlaceholder: '例如：计算机科学学士',
    graduationDate: '毕业日期',
    graduationDatePlaceholder: '毕业日期',
    certificate: '证书',
    addCertificate: '添加证书',
    certificateName: '证书名称',
    certificateNamePlaceholder: '例如：AWS 认证开发人员',
    date: '日期',
    datePlaceholder: '日期',
    skills: '技能',
    addSkill: '添加技能',
    skillName: '技能名称',
    skillNamePlaceholder: '例如：JavaScript, React',
    languages: '语言',
    addLanguage: '添加语言',
    languageName: '语言',
    languageNamePlaceholder: '例如：中文',
    proficiency: '熟练度',
    selectProficiency: '选择熟练度',
    beginner: '入门',
    intermediate: '中等',
    expert: '精通',
    websites: '网站与作品集',
    addWebsite: '添加网站',
    websiteName: '网站名称',
    websiteNamePlaceholder: '例如：我的 GitHub',
    websiteURL: '网址',
    websiteURLPlaceholder: '网址 (可选)',
    remove: '移除',
    resumePreview: '简历预览',
    generatePdf: '生成 PDF',
    loading: '加载中...',
    uploadAvatar: '上传头像',
    avatar: '头像',
    theme: '主题',
    theme1: '主题 1',
    theme2: '主题 2',
    theme3: '主题 3',
    customize: '自定义',
    switchLanguage: 'Switch Language',
    customColors: '自定义颜色',
    bgColor: '背景色',
    textColor: '文字色',
    borderColor: '边框色',
    projects: '项目经历',
    addProject: '添加项目',
    projectTitle: '项目名称',
    projectTitlePlaceholder: '例如：电子商务网站',
    projectURL: '网址',
    projectURLPlaceholder: '网址 (可选)',
    projectDescription: '项目描述',
    projectDescriptionPlaceholder: '简要描述你的项目',
    awards: '荣誉奖项',
    addAward: '添加奖项',
    awardName: '奖项名称',
    awardNamePlaceholder: '例如：最佳开发者奖',
    awardDate: '日期',
    awardDatePlaceholder: '日期',
    volunteering: '志愿服务',
    addVolunteering: '添加志愿服务',
    organization: '组织名称',
    organizationPlaceholder: '例如：红十字会',
    role: '担任角色',
    rolePlaceholder: '例如：活动协调员',
  }
};

  const [language, setLanguage] = useState('en'); // <--语言
  const [theme, setTheme] = useState('classic'); // <-- 主题状态
  const [customColors, setCustomColors] = useState({ // <-- 自定义颜色状态
    background: '#ffffff',
    text: '#333333',
    border: '#cccccc',
  });
  const [resumeData, setResumeData] = useState({
    personalInfo: {
    avatar: null,
    name: '',
    email: '',
    phone: '',
    },
    workExperience: [{
    id: crypto.randomUUID(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
    }],
    education: [{
      id: crypto.randomUUID(),
      institution: '',
      qualification: '',
      graduationDate: '',
      url: '',
    }],
    certificate: [{
      id: crypto.randomUUID(),
      name: '',
      date: '',
      url: '',
    }],
    skills: [{
      id: crypto.randomUUID(),
      name:'',
      proficiency: '',
    }],
    languages: [{
      id: crypto.randomUUID(),
      name: '',
      proficiency: '',
    }],
    aboutMe: '',
    website: [{
      id: crypto.randomUUID(),
      name: '',
      url: '',
    }],
    projects: [{
      id: crypto.randomUUID(),
      title: '',
      description: '',
      url: '',
    }],
    awards: [{
      id: crypto.randomUUID(),
      name: '',
      date: '',
    }],
    volunteering: [{
      id: crypto.randomUUID(),
      organization: '',
      role: '',
    }],
  });
  const [sectionOrder, setSectionOrder] = useState([
    'personalInfo',
    'aboutMe',
    'workExperience',
    'education',
    'projects',
    'certificate',
    'awards',
    'skills',
    'languages',
    'volunteering',
    'websites',
  ]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSectionOrder((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
     });
    }
  };

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('resumeData');
      if (savedData) {
        setResumeData(JSON.parse(savedData));
      }
    } catch (error) {
        console.error("Failed to parse resume data from localStorage", error);
      }
  }, []);

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  const t = translations[language];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setResumeData(prevData => ({ ...prevData,personalInfo: { ...prevData.personalInfo, avatar: reader.result }}));
        };
        reader.readAsDataURL(file);
      }
    };

  const handleRemoveAvatar = () => {
    setResumeData(prevData => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
      avatar: null, // 清空头像
      },
    }));
  };

  // 处理静态字段的函数
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prevData => ({ ...prevData, 
       personalInfo: {
      ...prevData.personalInfo,
      [name]: value }
    }));
  };

  const handleAboutMeChange = (e) => {
    const { value } = e.target;
    setResumeData(prevData => ({
        ...prevData,
        aboutMe: value // 正确地更新 aboutMe 字符串
    }));
};


  // 处理动态列表的函数，需要 section 和 id
  const handleInputChange = (e, section, id) => {
    const { name, value } = e.target;
    setResumeData(prevData => {
      if (prevData[section] && Array.isArray(prevData[section])) {
        return {
          ...prevData,
          [section]: prevData[section].map(item =>
            item.id === id ? { ...item, [name]: value } : item
          ),
        };
      }
      return { ...prevData, [name]: value };
    });
  };

  const handleAddSection = (sectionName, initialData) => {
    setResumeData(prevData => ({
      ...prevData,
      [sectionName]: [
        ...prevData[sectionName],
        { ...initialData, id: crypto.randomUUID() },
      ],
    }));
  };

  const handleRemoveSection = (sectionName, id) => {
    if(resumeData[sectionName].length > 1) {
      setResumeData(prevData => ({
        ...prevData,
        [sectionName]: prevData[sectionName].filter(item => item.id !== id),
      }));
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // 切换到预设主题时，清空自定义颜色，让预设主题生效
    document.documentElement.style.setProperty('--custom-background', '');
    document.documentElement.style.setProperty('--custom-text', '');
    document.documentElement.style.setProperty('--custom-border', '');
  };

  const handleCustomColorChange = (e) => {
    const { name, value } = e.target;
    setCustomColors(prevColors => ({ ...prevColors, [name]: value }));
    setTheme('custom');
    // 直接更新 CSS 变量，确保颜色能立即渲染出来
    document.documentElement.style.setProperty(`--custom-${name}`, value);
  };

  const cleanedResumeData = sanitizeForPdf(resumeData);

  return (
  <ErrorBoundary>
  <div className={`container theme-${theme}`}>
    <header className='header'>
      <div className='header-left'>
        <span className='logo'>{t.title}</span>
      </div>
      
      <div className='header-right'>
        <a href="https://jasonkong-coder.github.io/Personal-Portfolio/">{t.home}</a>
        <a href="https://github.com/JasonKong-coder?tab=repositories">{t.more}</a>
        <button className='language-button' onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}>
          {t.switchLanguage}
        </button>
      </div>
    </header>

    <main className='main-content'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
      <SortableContext
        items={sectionOrder}
        strategy={verticalListSortingStrategy}
      >
        <div className='input-panel'>
          <div className="theme-selector">
          <h2 className="section-title">{t.theme}</h2>
          <div className="theme-buttons">
            <button onClick={() => handleThemeChange('classic')} className={theme === 'classic' ? 'active' : ''}>{t.theme1}</button>
            <button onClick={() => handleThemeChange('modern')} className={theme === 'modern' ? 'active' : ''}>{t.theme2}</button>
            <button onClick={() => handleThemeChange('minimalist')} className={theme === 'minimalist' ? 'active' : ''}>{t.theme3}</button>
          </div>
        </div>
        
        <div className="custom-colors-container">
          <h3>{t.customColors}</h3>
          <div className="color-picker-group">
            <label>{t.bgColor}</label>
            <input type="color" name="background" value={customColors.background} onChange={handleCustomColorChange} />
          </div>
          
          <div className="color-picker-group">
            <label>{t.textColor}</label>
            <input type="color" name="text" value={customColors.text} onChange={handleCustomColorChange} />
          </div>
          
          <div className="color-picker-group">
            <label>{t.borderColor}</label>
            <input type="color" name="border" value={customColors.border} onChange={handleCustomColorChange} />
          </div>
        </div>
        
        <DraggableSection id="personalInfo">
          <PersonalInfo
            t={t}
            resumeData={resumeData}
            handlePersonalInfoChange={handlePersonalInfoChange}
            handleAvatarChange={handleAvatarChange}
            handleRemoveAvatar={handleRemoveAvatar}
          />
        </DraggableSection>
        
        <DraggableSection id="aboutMe">
          <AboutMe
            t={t}
            resumeData={resumeData}
            handleAboutMeChange={handleAboutMeChange}
          />
        </DraggableSection>
        
        <DraggableSection id="workExperience">
          <WorkExperience
            t={t}
            resumeData={resumeData}
            handleInputChange={handleInputChange}
            handleAddSection={handleAddSection}
            handleRemoveSection={handleRemoveSection}
          />
        </DraggableSection>
          
        <DraggableSection id="education">
          <Education
            t={t}
            resumeData={resumeData}
            handleInputChange={handleInputChange}
            handleAddSection={handleAddSection}
            handleRemoveSection={handleRemoveSection}
          />
        </DraggableSection>

        <DraggableSection id="projects">
          <Projects
            t={t}
            resumeData={resumeData}
            handleInputChange={handleInputChange}
            handleAddSection={handleAddSection}
            handleRemoveSection={handleRemoveSection}
          />
        </DraggableSection>
        
        <DraggableSection id="certificate">
          <Certificate
            t={t}
            resumeData={resumeData}
            handleInputChange={handleInputChange}
            handleAddSection={handleAddSection}
            handleRemoveSection={handleRemoveSection}
          />
        </DraggableSection>
        
        <DraggableSection id="awards">
          <Awards
            t={t}
            resumeData={resumeData}
            handleInputChange={handleInputChange}
            handleAddSection={handleAddSection}
            handleRemoveSection={handleRemoveSection}
          />
        </DraggableSection>
        
        <DraggableSection id="skills">
          <Skills
            t={t}
            resumeData={resumeData}
            handleInputChange={handleInputChange}
            handleAddSection={handleAddSection}
            handleRemoveSection={handleRemoveSection}
          />
        </DraggableSection>
        
        <DraggableSection id="languages">
          <Languages
            t={t}
            resumeData={resumeData}
            handleInputChange={handleInputChange}
            handleAddSection={handleAddSection}
            handleRemoveSection={handleRemoveSection}
          />
        </DraggableSection>
        
        <DraggableSection id="volunteering">
          <Volunteering
            t={t}
            resumeData={resumeData}
            handleInputChange={handleInputChange}
            handleAddSection={handleAddSection}
            handleRemoveSection={handleRemoveSection}
          />
        </DraggableSection>
        
        <DraggableSection id="websites">
          <Websites
            t={t}
            resumeData={resumeData}
            handleInputChange={handleInputChange}
            handleAddSection={handleAddSection}
            handleRemoveSection={handleRemoveSection}
          />
        </DraggableSection>
      </div>
      </SortableContext>
    </DndContext>
      
      <div className='preview-panel'>
        <div className='preview-header'>
          <h2>{t.resumePreview}</h2>
        </div>
        <div id="resume-preview" ref={resumeRef} className='resume-content'>
          {sectionOrder.map((sectionId) => {
            switch (sectionId) {
              case 'personalInfo':
              return (
                <section key={sectionId} className='personal-info-preview'>
                  {resumeData.personalInfo.avatar && (
                    <img src={resumeData.personalInfo.avatar} alt="Avatar" className='avatar-preview' />
                  )}
                  <h3>{resumeData.personalInfo.name}</h3>
                  <p>邮箱/Email: {resumeData.personalInfo.email}</p>
                  <p>电话/Contact: {resumeData.personalInfo.phone}</p>
                </section>
              );
              case 'aboutMe':
              return resumeData.aboutMe && (
                <section key={sectionId} className='about-me-preview'>
                  <h3>{t.aboutMe}</h3>
                  <p>{resumeData.aboutMe}</p>
                </section>
              );
              case 'workExperience':
              return resumeData.workExperience.length > 0 && resumeData.workExperience[0].company !== '' && (
                <section key={sectionId} className='work-experience-preview'>
                  <h3>{t.workExperience}</h3>
                  {resumeData.workExperience.map((job) => (
                    <div key={job.id} className='job-entry'>
                      <h4>{job.position} @ {job.company}</h4>
                      <p>{job.startDate} - {job.endDate}</p>
                      <p>{job.responsibilities}</p>
                    </div>
                  ))}
                </section>
              );
              case 'education':
              return resumeData.education.length > 0 && resumeData.education[0].institution !== '' && (
                <section key={sectionId} className="education-preview">
                  <h3>{t.education}</h3>
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="education-entry">
                      <h4>
                        {edu.url ? (
                          <a href={edu.url} target="_blank" rel="noopener noreferrer">{edu.qualification} @ {edu.institution}</a>
                        ) : (
                          <span>{edu.qualification} @ {edu.institution}</span>
                        )}
                      </h4>
                      <p>{edu.graduationDate}</p>
                    </div>
                  ))}
                </section>
              );
              case 'projects':
                return resumeData.projects.length > 0 && resumeData.projects[0].title !== '' && (
                  <section key={sectionId} className="projects-preview">
                    <h3>{t.projects}</h3>
                    {resumeData.projects.map((proj) => (
                      <div key={proj.id} className="project-entry">
                        <h4 className='project-title'>
                          {proj.url ? (
                            <a href={proj.url} target="_blank" rel="noopener noreferrer">{proj.title}</a>
                          ) : (
                            <span>{proj.title}</span>
                          )}
                        </h4>
                        <p>{proj.description}</p>
                      </div>
                    ))}
                  </section>
                );
              case 'certificate':
              return resumeData.certificate.length > 0 && resumeData.certificate[0].name !== '' && (
                <section key={sectionId} className="certificate-preview">
                  <h3>{t.certificate}</h3>
                  <ul>
                    {resumeData.certificate.map((cert) => (
                      <li key={cert.id}>
                        {cert.url ? (
                          <a href={cert.url} target="_blank" rel="noopener noreferrer">{cert.name}</a>
                        ) : (
                          <span>{cert.name}</span>
                        )}
                        <span> - {cert.date}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
              case 'awards':
              return resumeData.awards.length > 0 && resumeData.awards[0].name !== '' && (
                <section key={sectionId} className="awards-preview">
                  <h3>{t.awards}</h3>
                  <ul>
                    {resumeData.awards.map((award) => (
                      <li key={award.id}>{award.name} - {award.date}</li>
                    ))}
                  </ul>
                </section>
              );
              case 'skills':
              return resumeData.skills.length > 0 && resumeData.skills[0].name !== '' && (
                <section key={sectionId} className='skills-preview'>
                  <h3>{t.skills}</h3>
                  <ul className='skill-list'>
                    {resumeData.skills.map((skill) => (
                      <li key={skill.id} className='skill-item'>
                        {skill.name} {skill.proficiency && `- ${skill.proficiency}`}
                      </li>
                    ))}
                  </ul>
                </section>
              );
              case 'languages':
              return resumeData.languages.length > 0 && resumeData.languages[0].name !== '' && (
                <section key={sectionId} className='languages-preview'>
                  <h3>{t.languages}</h3>
                  <ul className='language-list'>
                    {resumeData.languages.map((lang) => (
                      <li key={lang.id} className='language-item'>
                        {lang.name} - {lang.proficiency}
                      </li>
                    ))}
                  </ul>
                </section>
              );
              case 'volunteering':
              return resumeData.volunteering.length > 0 && resumeData.volunteering[0].organization !== '' && (
                <section key={sectionId} className="volunteering-preview">
                  <h3>{t.volunteering}</h3>
                  {resumeData.volunteering.map((vol) => (
                    <div key={vol.id} className="volunteering-entry">
                      <h4>{vol.role} @ {vol.organization}</h4>
                    </div>
                  ))}
                </section>
              );
              case 'websites':
              return resumeData.website.length > 0 && resumeData.website[0].url !== '' && (
                <section key={sectionId} className='website-preview'>
                  <h3>{t.websites}</h3>
                  <ul className='website-list'>
                    {resumeData.website.map((site) => (
                      <li key={site.id} className='website-preview'>
                        <a href={site.url} target="_blank" rel="noopener noreferrer">{site.name || site.url}</a>
                      </li>
                    ))}
                  </ul>
                </section>
              );
              default:
              return null;
            }
          })}
        </div>
        <div>
          <PDFDownloadLink
            document={
              <ResumeDocument
                resumeData={cleanedResumeData}
                t={t}
                sectionOrder={sectionOrder}
                theme={theme}
                customColors={customColors}
              />
            }
            fileName="resume.pdf"
            className="generate-pdf-button"
          >
            {({ loading }) => (loading ? t.loading : t.generatePdf)}
          </PDFDownloadLink>
        </div>
      </div>
    </main>
  </div>
  </ErrorBoundary>
  );
};

export default App;