'use client';
import type { ResumeAnalysisOutput } from '@/ai/schemas';
import React, { forwardRef } from 'react';
import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeAnalysisOutput;
}

export const ClassicTemplate = forwardRef<HTMLDivElement, TemplateProps>(({ data }, ref) => {
  return (
    <div ref={ref} className="p-8 font-serif bg-white text-gray-800">
      <header className="text-center mb-8 border-b-2 border-gray-400 pb-4">
        <h1 className="text-4xl font-bold tracking-wider uppercase">{data.name}</h1>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 mt-3 text-sm flex-wrap">
          {data.contact.email && <div className="flex items-center gap-1"><Mail size={14} /><span>{data.contact.email}</span></div>}
          {data.contact.phone && <div className="flex items-center gap-1"><Phone size={14} /><span>{data.contact.phone}</span></div>}
          {data.contact.linkedin && <div className="flex items-center gap-1"><Linkedin size={14} /><span>{data.contact.linkedin}</span></div>}
          {data.contact.github && <div className="flex items-center gap-1"><Github size={14} /><span>{data.contact.github}</span></div>}
          {data.contact.website && <div className="flex items-center gap-1"><Globe size={14} /><span>{data.contact.website}</span></div>}
        </div>
      </header>

      <main>
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-2 uppercase tracking-widest">Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-3 uppercase tracking-widest">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">{skill}</span>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-3 uppercase tracking-widest">Experience</h2>
          <div className="space-y-4">
            {data.experiences.map((exp, index) => (
              <div key={index} className="text-sm">
                <h3 className="text-lg font-bold">{exp.title}</h3>
                <p className="font-semibold text-md italic">{exp.company}</p>
                <p className="mt-1 text-gray-700 leading-normal">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-1 mb-3 uppercase tracking-widest">Education</h2>
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index} className="text-sm">
                <h3 className="text-lg font-bold">{edu.degree}</h3>
                <p className="font-semibold text-md">{edu.school} {edu.year && ` - ${edu.year}`}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
});

ClassicTemplate.displayName = 'ClassicTemplate';
