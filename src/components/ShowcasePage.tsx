import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Image as ImageIcon,
  Heart,
  MessageSquare,
  Share2,
  Plus,
  Sparkles,
  CheckCircle2,
  Trash2,
  X,
  Search,
  ExternalLink,
  Send,
  User,
  Building2,
  Tag,
  Upload,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { CertificateAttachment, ShowcasePost } from '../types';

export const ShowcasePage: React.FC = () => {
  const {
    currentStudent,
    currentCompany,
    role,
    posts,
    createPost,
    likePost,
    commentOnPost,
    deletePost,
    courses
  } = useApp();

  // Feed Filter States
  const [activeTab, setActiveTab] = useState<'all' | 'certificate' | 'experience' | 'project' | 'mine'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Create Post Form States
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const [postType, setPostType] = useState<'certificate' | 'experience' | 'project' | 'achievement'>('experience');
  const [bioHeadline, setBioHeadline] = useState<string>(
    currentStudent
      ? `${currentStudent.year || 'Student'} ${currentStudent.branch || ''} @ ${currentStudent.college || 'University'}`
      : currentCompany
      ? `${currentCompany.industry || 'Company'} @ ${currentCompany.companyName}`
      : 'Tech Enthusiast & Student Developer'
  );
  const [content, setContent] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [certificates, setCertificates] = useState<CertificateAttachment[]>([]);
  const [tags, setTags] = useState<string[]>(['SkillBridge', 'Portfolio']);
  const [tagInput, setTagInput] = useState<string>('');

  // Custom Certificate Form
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [certTitle, setCertTitle] = useState<string>('');
  const [certIssuer, setCertIssuer] = useState<string>('SkillBridge Verified');
  const [certDate, setCertDate] = useState<string>('Sept 2026');

  // Interactive Lightbox State
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Active Comment Input States (postId -> text)
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Image Upload handler (File & URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrls((prev) => [...prev, String(uploadEvent.target?.result)]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrlImage = () => {
    if (!customImageUrl.trim()) return;
    setImageUrls((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  const handleAddTag = () => {
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddCustomCert = () => {
    if (!certTitle.trim()) return;
    const newCert: CertificateAttachment = {
      id: `cert_${Date.now()}`,
      title: certTitle.trim(),
      issuer: certIssuer.trim() || 'SkillBridge',
      date: certDate || 'Sept 2026',
      isVerified: true
    };
    setCertificates([...certificates, newCert]);
    setCertTitle('');
    setShowCertModal(false);
    showToast('Certificate badge attached to post!');
  };

  const handleSelectCompletedCourseCert = (courseTitle: string) => {
    if (certificates.some((c) => c.title === courseTitle)) return;
    const newCert: CertificateAttachment = {
      id: `cert_${Date.now()}`,
      title: courseTitle,
      issuer: 'SkillBridge Verified Ecosystem',
      date: 'Sept 2026',
      isVerified: true
    };
    setCertificates([...certificates, newCert]);
    showToast(`Attached verified certificate for ${courseTitle}!`);
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Please enter post content or experience story.');
      return;
    }

    const success = await createPost({
      bioHeadline: bioHeadline.trim(),
      content: content.trim(),
      postType,
      certificates,
      images: imageUrls,
      tags: tags.length ? tags : ['SkillBridge', postType],
      authorAvatar: currentStudent
        ? `https://api.dicebear.com/7.x/bottts/svg?seed=${currentStudent.name}`
        : currentCompany?.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    if (success) {
      showToast('🎉 Your post has been published to the SkillBridge Showcase Feed!');
      setIsCreatingPost(false);
      setContent('');
      setImageUrls([]);
      setCertificates([]);
      setTags(['SkillBridge', 'Portfolio']);
    }
  };

  const handleSharePost = (postId: string) => {
    navigator.clipboard?.writeText(`${window.location.origin}/#post-${postId}`);
    showToast('🔗 Post link copied to clipboard!');
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    // Tab filter
    if (activeTab === 'certificate' && post.postType !== 'certificate') return false;
    if (activeTab === 'experience' && post.postType !== 'experience') return false;
    if (activeTab === 'project' && post.postType !== 'project') return false;
    if (activeTab === 'mine') {
      const currentId = currentStudent?.id || currentCompany?.id;
      if (post.authorId !== currentId) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = post.authorName.toLowerCase().includes(query);
      const matchContent = post.content.toLowerCase().includes(query);
      const matchBio = post.bioHeadline.toLowerCase().includes(query);
      const matchTags = post.tags.some((t) => t.toLowerCase().includes(query));
      return matchName || matchContent || matchBio || matchTags;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-indigo-400/30 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-8 border border-slate-800 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Award className="w-4 h-4 text-amber-400" /> Student Experience & Portfolio Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-outfit">
              SkillBridge <span className="text-gradient">Showcase Feed</span>
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              Post verified course certificates, introduce your student bio headline, upload project photo galleries, and share your internship journey with recruiters & peers.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingPost(!isCreatingPost)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            {isCreatingPost ? 'Close Editor' : 'Share Experience or Certificate'}
          </button>
        </div>
      </div>

      {/* CREATE POST EDITOR CARD */}
      {isCreatingPost && (
        <div className="mb-10 glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl bg-slate-900/90 relative animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Create Showcase Post</h3>
                <p className="text-xs text-slate-400">Share your certificates & experience story</p>
              </div>
            </div>

            <button
              onClick={() => setIsCreatingPost(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitPost} className="space-y-6">
            {/* Post Type Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'certificate', label: 'Certificate', icon: Award, color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
                { id: 'experience', label: 'Experience Story', icon: Sparkles, color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
                { id: 'project', label: 'Project Demo', icon: ImageIcon, color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
                { id: 'achievement', label: 'Achievement', icon: CheckCircle2, color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = postType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPostType(item.id as any)}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-semibold transition-all ${
                      isSelected
                        ? `${item.color} shadow-lg ring-2 ring-indigo-500/50`
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 bg-slate-950/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Editable Bio Headline */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Your Bio / Profile Headline (Shown on Post)
              </label>
              <input
                type="text"
                value={bioHeadline}
                onChange={(e) => setBioHeadline(e.target.value)}
                placeholder="e.g. 3rd Year CS Student @ IIT Bombay | Full Stack & AI Enthusiast"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Post Experience / Story Content
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write about what you achieved, your internship learnings, certificate milestones, or project details..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            {/* ATTACH CERTIFICATE SECTION */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" /> Attach Verified Certificates
                </span>
                <button
                  type="button"
                  onClick={() => setShowCertModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Custom Certificate
                </button>
              </div>

              {/* Quick Select Completed Course Certificates if Student */}
              {currentStudent?.completedCourses?.length ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentStudent.completedCourses.map((courseId) => {
                    const c = courses.find((crs) => crs.id === courseId);
                    if (!c) return null;
                    const isAttached = certificates.some((cert) => cert.title === c.title);
                    return (
                      <button
                        key={courseId}
                        type="button"
                        onClick={() => handleSelectCompletedCourseCert(c.title)}
                        className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-all ${
                          isAttached
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/40'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        {c.title}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {/* Attached Certificates List */}
              {certificates.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {certificates.map((cert, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 text-amber-200 text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-white truncate">{cert.title}</p>
                          <p className="text-[10px] text-amber-300/80">{cert.issuer} • {cert.date}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCertificates(certificates.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-400 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MULTIPLE PHOTO UPLOAD SECTION */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" /> Upload Photos (Multiple Photos Supported)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Local File Picker */}
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/50 cursor-pointer text-slate-300 text-xs transition-colors">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span>Choose Images from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Direct Image URL input */}
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Or paste image URL..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Uploaded Images Preview Thumbnails */}
              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 group">
                      <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TAGS INPUT */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Skill & Experience Tags
              </label>
              <div className="flex items-center gap-2 mb-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag e.g. React, Internship, Hackathon (Press Enter)"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingPost(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all"
              >
                Publish Showcase Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CUSTOM CERTIFICATE MODAL */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-800 bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Custom Certificate Details
              </h3>
              <button onClick={() => setShowCertModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Certificate Title</label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services / SkillBridge"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Issue Date</label>
                <input
                  type="text"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  placeholder="e.g. Sept 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomCert}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow"
              >
                Attach Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Feed' },
            { id: 'certificate', label: 'Certificates' },
            { id: 'experience', label: 'Experiences' },
            { id: 'project', label: 'Projects' },
            { id: 'mine', label: 'My Posts' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feed by keyword or tag..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* FEED POST CARDS LIST */}
      {filteredPosts.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 bg-slate-900/40">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Showcase Posts Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">
            Be the first student to publish your certificates or share your experience in this filter view!
          </p>
          <button
            onClick={() => setIsCreatingPost(true)}
            className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const currentUserId = currentStudent?.id || currentCompany?.id || 'guest_user';
            const isLiked = post.likedBy.includes(currentUserId);
            const isOwner = post.authorId === currentUserId;
            const commentsOpen = Boolean(expandedComments[post.id]);

            return (
              <div
                key={post.id}
                id={`post-${post.id}`}
                className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800/80 bg-slate-900/60 shadow-xl hover:border-slate-700/80 transition-all duration-300"
              >
                {/* Author Header Row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md">
                      <img
                        src={
                          post.authorAvatar ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${post.authorName}`
                        }
                        alt={post.authorName}
                        className="w-full h-full rounded-[14px] object-cover bg-slate-950"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base font-outfit">{post.authorName}</h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Verified Student
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">{post.bioHeadline}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {post.authorCollege && `${post.authorCollege} • `}
                        {post.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Post Type Badge */}
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                        post.postType === 'certificate'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : post.postType === 'project'
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {post.postType.toUpperCase()}
                    </span>

                    {/* Delete button if owner */}
                    {isOwner && (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Experience Content */}
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-5">
                  {post.content}
                </p>

                {/* ATTACHED CERTIFICATE CARDS */}
                {post.certificates && post.certificates.length > 0 && (
                  <div className="mb-5 space-y-3">
                    {post.certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="rounded-2xl p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex items-center justify-between gap-4 shadow-inner"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                            <Award className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-white text-sm">{cert.title}</h5>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> VERIFIED
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              Issued by <span className="text-slate-200 font-medium">{cert.issuer}</span> • {cert.date}
                            </p>
                          </div>
                        </div>

                        <div className="hidden sm:block">
                          <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                            SkillBridge Certified <ExternalLink className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* MULTI-PHOTO GALLERY GRID */}
                {post.images && post.images.length > 0 && (
                  <div className="mb-5 rounded-2xl overflow-hidden border border-slate-800">
                    {post.images.length === 1 ? (
                      <div
                        onClick={() => {
                          setLightboxImages(post.images);
                          setLightboxIndex(0);
                        }}
                        className="cursor-pointer group relative max-h-96 overflow-hidden bg-slate-950"
                      >
                        <img
                          src={post.images[0]}
                          alt="Showcase media"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1 bg-slate-950">
                        {post.images.slice(0, 4).map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setLightboxImages(post.images);
                              setLightboxIndex(idx);
                            }}
                            className="relative aspect-video overflow-hidden cursor-pointer group"
                          >
                            <img
                              src={img}
                              alt={`Showcase media ${idx}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {idx === 3 && post.images.length > 4 && (
                              <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-white font-bold text-lg">
                                +{post.images.length - 4} photos
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAGS PILLS */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-indigo-400 font-medium hover:border-indigo-500/40 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* INTERACTION ACTION BAR */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <div className="flex items-center gap-4">
                    {/* Like / Upvote Button */}
                    <button
                      onClick={() => likePost(post.id)}
                      className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                        isLiked
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{post.likesCount} Likes</span>
                    </button>

                    {/* Comment Toggle Button */}
                    <button
                      onClick={() =>
                        setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                      }
                      className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <span>{post.comments.length} Comments</span>
                    </button>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={() => handleSharePost(post.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 px-3 py-2 rounded-xl hover:bg-slate-800/60 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                {/* EXPANDABLE COMMENTS SECTION */}
                {commentsOpen && (
                  <div className="mt-5 pt-4 border-t border-slate-800/60 space-y-4 animate-fadeIn">
                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            commentOnPost(post.id, commentInputs[post.id] || '');
                            setCommentInputs((prev) => ({ ...prev, [post.id]: '' }));
                          }
                        }}
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => {
                          commentOnPost(post.id, commentInputs[post.id] || '');
                          setCommentInputs((prev) => ({ ...prev, [post.id]: '' }));
                        }}
                        className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Comments List */}
                    {post.comments.length > 0 && (
                      <div className="space-y-3 pt-2">
                        {post.comments.map((comm) => (
                          <div
                            key={comm.id}
                            className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/60 flex items-start gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                              {comm.authorName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-xs">{comm.authorName}</span>
                                <span className="text-[10px] text-slate-500">{comm.createdAt}</span>
                              </div>
                              <p className="text-slate-300 text-xs mt-1">{comm.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {lightboxImages && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxImages(null)}
            className="absolute top-6 right-6 p-3 text-slate-400 hover:text-white bg-slate-900 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          {lightboxImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1))
                }
                className="absolute left-6 p-3 text-slate-300 hover:text-white bg-slate-900/80 rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setLightboxIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0))
                }
                className="absolute right-6 p-3 text-slate-300 hover:text-white bg-slate-900/80 rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <img
              src={lightboxImages[lightboxIndex]}
              alt={`Expanded showcase view ${lightboxIndex}`}
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
