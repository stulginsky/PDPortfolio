export type ResumeBullet = {
  label?: string;
  text?: string;
  lines?: string[];
};

export type ResumeExperience = {
  heading: string;
  headingLines?: string[];
  bullets?: ResumeBullet[];
  paragraphs?: string[];
};

export type ResumeSkillSection = {
  title: string;
  body: string;
};

export type ResumeEducationEntry = {
  org: string;
  detail: string;
};

export type ResumeContent = {
  summary: string[];
  experience: ResumeExperience[];
  education: {
    title: string;
    entries: ResumeEducationEntry[];
  };
  highlights: {
    title: string;
    items: ResumeBullet[];
  };
  skills: ResumeSkillSection[];
};
