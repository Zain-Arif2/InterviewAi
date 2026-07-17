'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema } from '@/validators/profile.validator';
import { updateProfileAction } from '@/actions/profile.actions';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Loader2, Save, X, Plus } from 'lucide-react';
import { EXPERIENCE_LEVELS, COMMON_SKILLS } from '@/lib/constants';

export function ProfileForm({ user }) {
  const { update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(user?.skills || []);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      currentRole: user?.currentRole || '',
      experienceLevel: user?.experienceLevel || '',
      targetJobRole: user?.targetJobRole || '',
      skills: user?.skills || [],
    },
  });

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed) && skills.length < 20) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
    setShowSuggestions(false);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const filteredSuggestions = skillInput.length > 0
    ? COMMON_SKILLS.filter(
        (s) =>
          s.toLowerCase().includes(skillInput.toLowerCase()) &&
          !skills.includes(s)
      ).slice(0, 5)
    : [];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const submissionData = { ...data, skills };
      const result = await updateProfileAction(submissionData);
      
      if (result.success) {
        toast.success('Profile updated successfully');
        await updateSession({
          name: submissionData.name,
          image: result.data?.image,
        });
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine form dirty state based on input tracking and local state tracking for tags array
  const isFormDirty = isDirty || JSON.stringify(skills) !== JSON.stringify(user?.skills || []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full rounded-xl py-2.5 px-4 text-sm outline-none transition-all duration-200 focus-ring"
            style={{
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            }}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Current Role */}
        <div>
          <label htmlFor="currentRole" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Current Role
          </label>
          <input
            id="currentRole"
            type="text"
            {...register('currentRole')}
            className="w-full rounded-xl py-2.5 px-4 text-sm outline-none transition-all duration-200 focus-ring"
            style={{
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            }}
            placeholder="e.g. Software Engineer"
          />
          {errors.currentRole && (
            <p className="mt-1.5 text-xs text-destructive">{errors.currentRole.message}</p>
          )}
        </div>

        {/* Experience Level */}
        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Experience Level
          </label>
          <select
            id="experienceLevel"
            {...register('experienceLevel')}
            className="w-full rounded-xl py-2.5 px-4 text-sm outline-none transition-all duration-200 focus-ring appearance-none"
            style={{
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            }}
          >
            <option value="">Select Level</option>
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          {errors.experienceLevel && (
            <p className="mt-1.5 text-xs text-destructive">{errors.experienceLevel.message}</p>
          )}
        </div>

        {/* Target Job Role */}
        <div>
          <label htmlFor="targetJobRole" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Target Job Role
          </label>
          <input
            id="targetJobRole"
            type="text"
            {...register('targetJobRole')}
            className="w-full rounded-xl py-2.5 px-4 text-sm outline-none transition-all duration-200 focus-ring"
            style={{
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            }}
            placeholder="e.g. Senior Backend Engineer"
          />
          {errors.targetJobRole && (
            <p className="mt-1.5 text-xs text-destructive">{errors.targetJobRole.message}</p>
          )}
        </div>

        {/* Skills Tag Field */}
        <div className="sm:col-span-2">
          <label htmlFor="skills-input" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Technical Skills ({skills.length}/20)
          </label>
          <div className="relative">
            <div className="flex flex-wrap gap-2 p-2 rounded-xl w-full min-h-[46px]"
              style={{
                background: 'var(--secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors"
                  style={{
                    background: 'var(--card)',
                    color: 'var(--foreground)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                id="skills-input"
                type="text"
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={handleSkillKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="flex-1 bg-transparent border-0 outline-none p-1 text-sm min-w-[120px]"
                style={{ color: 'var(--foreground)' }}
                placeholder={skills.length === 0 ? "Type skill and press Enter..." : ""}
                disabled={skills.length >= 20}
              />
            </div>

            {/* Auto-suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1.5 rounded-xl border p-1 shadow-lg max-h-48 overflow-y-auto"
                style={{
                  background: 'var(--card)',
                  borderColor: 'var(--border)',
                }}
              >
                {filteredSuggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => addSkill(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors flex items-center justify-between"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {suggestion}
                      <Plus size={14} className="text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !isFormDirty}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 disabled:opacity-40 group"
          style={{ background: 'var(--primary)' }}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} className="transition-transform group-hover:scale-110" />
          )}
          Save Changes
        </button>
      </div>
    </form>
  );
}