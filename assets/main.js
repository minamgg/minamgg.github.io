const siteData = window.siteData || {};
const publications = siteData.publications || [];
const awards = siteData.awards || [];
const profile = siteData.profile || {};
const links = siteData.links || [];
const education = siteData.education || [];
const experienceProjects = siteData.experienceProjects || [];
const academicService = siteData.academicService || [];

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
    if (!window.location.hash) window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", function() {
    const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
    const getLink = (key) => links.find((link) => link.key === key);
    const isPlaced = (link, placement) => String(link.placement || "").split(",").map((item) => item.trim()).includes(placement);
    const setText = (id, value) => {
        const node = document.getElementById(id);
        if (node && value) node.textContent = value;
    };

    const fullName = profile.fullName || "Min Wu";
    const heroTypewriter = document.getElementById("hero-typewriter");
    if (heroTypewriter) {
        const fullHeroText = heroTypewriter.textContent.trim();
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduceMotion && fullHeroText) {
            heroTypewriter.setAttribute("aria-label", fullHeroText);
            heroTypewriter.textContent = "";
            heroTypewriter.classList.add("typing-active");
            let index = 0;
            const typeNext = () => {
                index += 1;
                heroTypewriter.textContent = fullHeroText.slice(0, index);
                if (index < fullHeroText.length) {
                    const char = fullHeroText[index - 1];
                    const delay = /[.,]/.test(char) ? 210 : char === " " ? 42 : 34 + Math.random() * 24;
                    window.setTimeout(typeNext, delay);
                } else {
                    window.setTimeout(() => heroTypewriter.classList.remove("typing-active"), 900);
                }
            };
            window.setTimeout(typeNext, 360);
        }
    }

    document.title = `${fullName} - Academic Profile`;
    setText("site-initials", profile.siteInitials || fullName.split(/\s+/).map((part) => part[0]).join("").slice(0, 3).toUpperCase());
    setText("profile-name", fullName);
    const profileTitle = document.getElementById("profile-title");
    if (profileTitle && profile.currentTitle) {
        profileTitle.innerHTML = escapeHtml(profile.currentTitle)
            .replace(", School of Civil and Environmental Engineering, ", "<br>School of Civil and Environmental Engineering<br>");
    }
    setText("profile-short-bio", profile.shortBio);
    setText("profile-research-focus-1", profile.researchFocus1);
    setText("profile-research-focus-2", profile.researchFocus2);
    setText("publication-summary", profile.publicationSummary);
    setText("awards-summary", profile.awardsSummary);
    setText("footer-copyright", `© 2026 ${fullName}. All rights reserved.`);

    const contactLink = getLink("email");
    const navContact = document.getElementById("nav-contact-link");
    if (contactLink && navContact) navContact.href = contactLink.url;

    const avatar = document.getElementById("avatar-gif");
    if (avatar) {
        avatar.src = `assets/${profile.avatarFile || "avatar.png"}`;
        avatar.alt = fullName;
    }

    const profileLinks = document.getElementById("profile-links");
    if (profileLinks) {
        profileLinks.innerHTML = links
            .filter((link) => link.url && isPlaced(link, "profile"))
            .map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" class="inline-flex items-center gap-1 whitespace-nowrap text-[#0071e3] hover:underline font-medium text-[17px]">${escapeHtml(link.label)} <i class="fas fa-chevron-right text-[10px]"></i></a>`)
            .join("");
    }

    const footerLinks = document.getElementById("footer-links");
    if (footerLinks) {
        footerLinks.innerHTML = links
            .filter((link) => link.url && isPlaced(link, "footer"))
            .map((link) => `<a href="${escapeHtml(link.url)}" ${link.url.startsWith("mailto:") ? "" : 'target="_blank"'} class="whitespace-nowrap hover:text-gray-900 transition-colors">${escapeHtml(link.label.replace(" Profile", ""))}</a>`)
            .join("");
    }

    const renderTimelineItems = (items) => items.map((item) => `
                <div class="timeline-item text-left">
                    <p class="text-[12px] font-bold text-[#0071E3] tracking-wider">${escapeHtml(item.period)}</p>
                    <h4 class="text-[17px] font-bold text-gray-900 mt-1 leading-tight">${escapeHtml(item.title)}</h4>
                    <p class="text-[15px] text-gray-500 mt-1">${escapeHtml(item.subtitle)}</p>
                </div>
        `).join("");

    const appointmentsList = document.getElementById("appointments-list");
    if (appointmentsList) {
        const appointmentItems = experienceProjects
            .filter((item) => String(item.category || "").toLowerCase().includes("work"))
            .map((item) => ({
                kind: "Academic Appointment",
                period: item.period || "",
                title: item.title || "",
                subtitle: [item.institution, item.role].filter(Boolean).join(" · ")
            }));
        appointmentsList.innerHTML = renderTimelineItems(appointmentItems);
    }

    const educationList = document.getElementById("education-list");
    if (educationList) {
        const educationItems = education.map((item) => ({
            kind: "Education",
            period: [item.start, item.end].filter(Boolean).join(" · "),
            title: `${item.degree}${item.field ? ` in ${item.field}` : ""}`,
            subtitle: `${item.institution}${item.location ? `, ${item.location}` : ""}`
        }));
        educationList.innerHTML = renderTimelineItems(educationItems);
    }

    const getInfoTone = (item) => {
        const category = String(item.category || item.type || "").toLowerCase();
        if (category.includes("funded")) return "tone-project";
        if (category.includes("editorial")) return "tone-editorial";
        if (category.includes("reviewer")) return "tone-reviewer";
        if (category.includes("presentation")) return "tone-presentation";
        if (category.includes("conference")) return "tone-conference";
        return "tone-work";
    };

    const renderInfoCard = (item, index) => `
        <article class="award-card info-card ${getInfoTone(item)}">
            <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0071E3]">${escapeHtml(item.category || item.type || "")}</p>
            <h3 class="mt-3 font-bold leading-tight text-gray-900">${escapeHtml(item.title || item.activity)}</h3>
            <p class="mt-3 font-medium text-gray-500">${escapeHtml(item.institution || item.venue || "")}</p>
            ${(item.period || item.year || item.role) ? `<p class="mt-2 text-gray-400">${escapeHtml([item.period || item.year, item.role].filter(Boolean).join(" · "))}</p>` : ""}
            ${item.description ? `<p class="mt-4 leading-relaxed text-gray-600">${escapeHtml(item.description)}</p>` : ""}
        </article>
    `;

    const fundedProjectList = document.getElementById("funded-project-list");
    const fundedProjects = experienceProjects
        .filter((item) => String(item.category || "").toLowerCase().includes("funded"));
    const getProjectRoleLabel = (role) => /principal investigator|^pi$/i.test(String(role || "")) ? "PI" : "Participant";
    const renderProjectCard = (item, index) => {
        const roleLabel = getProjectRoleLabel(item.role);
        return `
            <article class="award-card info-card tone-project project-card-custom" data-project-id="${index}">
                <div>
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="project-role-tag">${escapeHtml(roleLabel)}</span>
                    </div>
                    <h3 class="mt-5 font-bold leading-tight text-gray-900">${escapeHtml(item.title)}</h3>
                </div>
                <div class="relative z-10 flex items-end justify-between gap-4">
                    <div class="min-w-0 text-left">
                        <p class="font-medium text-gray-500 line-clamp-2">${escapeHtml(item.institution || "")}</p>
                        ${item.period ? `<p class="mt-2 text-gray-400">${escapeHtml(item.period)}</p>` : ""}
                    </div>
                    <button type="button" class="open-project-modal-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0071E3] text-white shadow-sm" data-project-id="${index}" aria-label="Open project details">
                        <i class="fas fa-plus text-sm"></i>
                    </button>
                </div>
            </article>
        `;
    };
    if (fundedProjectList) {
        fundedProjectList.innerHTML = fundedProjects.map(renderProjectCard).join("");
    }

    const serviceList = document.getElementById("service-list");
    if (serviceList) serviceList.innerHTML = academicService.map(renderInfoCard).join("");

    const avContainer = document.getElementById("avatar-container");
    if (avContainer) {
        avContainer.addEventListener("mouseenter", () => {
            const avImg = document.getElementById("avatar-gif");
            if (avImg) {
                const base = avImg.src.split("?")[0];
                avImg.src = base + "?t=" + Date.now();
            }
        });
    }

    const pubTrack = document.getElementById("pub-carousel-track");
    if (pubTrack) {
        const statusStyles = {
            "Working Paper": { card: "card-working-paper", text: "text-blue-500", bg: "bg-blue-500" },
            "Under Review": { card: "card-under-review", text: "text-amber-500", bg: "bg-amber-500" },
            "Thesis": { card: "card-thesis", text: "text-teal-600", bg: "bg-teal-500" },
            "Published": { card: "card-published", text: "text-emerald-500", bg: "bg-emerald-500" }
        };
        publications.forEach((pub) => {
            const card = document.createElement("div");
            const style = statusStyles[pub.status] || statusStyles.Published;
            const authorList = String(pub.authors || "").split(/[,;]/).map((name) => name.trim()).filter(Boolean);
            const authorSummary = authorList.length > 1 ? `${authorList[0].replace(/\*/g, "")} et al.` : authorList[0]?.replace(/\*/g, "") || "";
            const cardDate = /under review/i.test(String(pub.date || "")) ? "" : pub.date;
            const cardMeta = [pub.journalShort, cardDate].filter(Boolean).join(" · ");
            card.className = `pub-card-custom ${style.card} flex-none w-[280px] md:w-[340px] h-[460px] md:h-[500px] snap-center flex flex-col justify-between cursor-pointer`;
            card.dataset.id = pub.id;
            card.innerHTML = `
                <div class="relative z-10">
                    <p class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span class="${style.text} inline-flex items-center font-bold tracking-tight text-[11px] md:text-xs uppercase"><span class="${style.bg} mr-1.5 h-2 w-2 rounded-full"></span>${escapeHtml(pub.status)}</span>
                        <span class="text-gray-500 font-bold tracking-tight text-[11px] md:text-xs uppercase">${escapeHtml(pub.articleType)}</span>
                    </p>
                    <h3 class="text-2xl md:text-3xl font-bold leading-tight mb-4 tracking-tight text-gray-900 text-left">${escapeHtml(pub.title)}</h3>
                </div>
                <div class="relative z-10 flex justify-between items-end">
                    <div class="max-w-[75%] text-left">
                        <p class="text-sm text-gray-500 font-medium mb-1 line-clamp-1">${escapeHtml(authorSummary)}</p>
                        <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">${escapeHtml(cardMeta)}</p>
                    </div>
                    <button class="open-modal-btn w-10 h-10 rounded-full ${style.bg} text-white flex items-center justify-center hover:opacity-80 transition-all shadow-sm" data-id="${escapeHtml(pub.id)}">
                        <i class="fas fa-plus text-sm"></i>
                    </button>
                </div>
            `;
            pubTrack.appendChild(card);
        });
    }

    const awardsList = document.getElementById("awards-list");
    if (awardsList) {
        awardsList.innerHTML = "";
        awards.forEach((award, index) => {
            const li = document.createElement("li");
            li.className = "award-card";
            li.innerHTML = `<div class="award-icon mb-5"><i class="fas ${escapeHtml(award.icon)} text-lg"></i></div><div class="text-left"><h4 class="text-xl font-bold text-gray-900 leading-tight">${escapeHtml(award.title)}</h4><p class="text-gray-500 text-sm mt-3">${escapeHtml(award.detail)}</p><p class="text-gray-400 text-sm mt-2">${escapeHtml(award.issuer)}</p></div>`;
            awardsList.appendChild(li);
        });
    }

    const modal = document.getElementById("pub-modal-overlay");
    const absSec = document.getElementById("modal-abstract-section");
    const citSec = document.getElementById("modal-citation-section");
    const highlightAuthor = (authors) => escapeHtml(authors).replaceAll(fullName, `<strong class="font-bold text-[#0071E3]">${escapeHtml(fullName)}</strong>`);
    const getAuthorRoles = (authors) => {
        const parts = String(authors || "").split(/[,;]/).map((name) => name.trim()).filter(Boolean);
        return {
            firstAuthor: parts.some((name, index) => index === 0 && name.replace(/\*/g, "") === fullName),
            correspondingAuthor: parts.some((name) => name === `${fullName}*`)
        };
    };
    const renderAuthorTags = (authors) => {
        const roles = getAuthorRoles(authors);
        const tags = [];
        if (roles.firstAuthor) tags.push("First Author");
        if (roles.correspondingAuthor) tags.push("Corresponding Author");
        return tags.map((tag) => `<span class="inline-flex items-center rounded-full bg-[#EAF3FF] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0071E3]">${tag}</span>`).join("");
    };
    const openPublicationModal = (id) => {
        const pub = publications.find((item) => String(item.id) === String(id));
        if (!pub || !modal) return;
        document.getElementById("modal-journal-meta").innerText = `${pub.journalFull} · ${pub.date}`;
        document.getElementById("modal-title").innerText = pub.title;
        document.getElementById("modal-author-tags").innerHTML = renderAuthorTags(pub.authors);
        document.getElementById("modal-authors").innerHTML = highlightAuthor(pub.authors);
        document.getElementById("modal-keywords").innerText = pub.keywords;
        const hasAbstract = Boolean(pub.abstract);
        const hasCitation = Boolean(pub.citation);
        absSec.style.display = hasAbstract ? "block" : "none";
        citSec.style.display = hasCitation ? "block" : "none";
        if (hasAbstract) document.getElementById("modal-abstract").innerText = pub.abstract;
        if (hasCitation) document.getElementById("modal-citation").innerText = pub.citation;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    };
    document.addEventListener("click", (event) => {
        const btn = event.target.closest(".open-modal-btn");
        const card = event.target.closest(".pub-card-custom");
        if (btn) {
            event.stopPropagation();
            openPublicationModal(btn.dataset.id);
            return;
        }
        if (card) openPublicationModal(card.dataset.id);
    });

    const close = () => {
        if (modal) modal.classList.remove("active");
        document.body.style.overflow = "";
    };
    document.getElementById("close-modal")?.addEventListener("click", close);
    if (modal) modal.addEventListener("click", (event) => { if (event.target === modal) close(); });

    const projectModal = document.getElementById("project-modal-overlay");
    const openProjectModal = (index) => {
        const project = fundedProjects[Number(index)];
        if (!project || !projectModal) return;
        const roleLabel = getProjectRoleLabel(project.role);
        document.getElementById("project-modal-role-tag").innerText = roleLabel;
        document.getElementById("project-modal-title").innerText = project.title || "";
        document.getElementById("project-modal-funder").innerText = project.institution || "";
        document.getElementById("project-modal-role").innerText = project.role || roleLabel;
        const hasPeriod = Boolean(project.period);
        const hasDescription = Boolean(project.description);
        document.getElementById("project-modal-period-section").style.display = hasPeriod ? "block" : "none";
        document.getElementById("project-modal-description-section").style.display = hasDescription ? "block" : "none";
        if (hasPeriod) document.getElementById("project-modal-period").innerText = project.period;
        if (hasDescription) document.getElementById("project-modal-description").innerText = project.description;
        projectModal.classList.add("active");
        document.body.style.overflow = "hidden";
    };
    document.addEventListener("click", (event) => {
        const projectButton = event.target.closest(".open-project-modal-btn");
        const projectCard = event.target.closest(".project-card-custom");
        if (projectButton) {
            event.stopPropagation();
            openProjectModal(projectButton.dataset.projectId);
            return;
        }
        if (projectCard) openProjectModal(projectCard.dataset.projectId);
    });
    const closeProjectModal = () => {
        if (projectModal) projectModal.classList.remove("active");
        document.body.style.overflow = "";
    };
    document.getElementById("close-project-modal")?.addEventListener("click", closeProjectModal);
    if (projectModal) projectModal.addEventListener("click", (event) => { if (event.target === projectModal) closeProjectModal(); });

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const animateScrollTo = (targetY, duration = 900) => {
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();
        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            window.scrollTo(0, startY + distance * easeOutExpo(progress));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const hash = link.getAttribute("href");
            const target = hash === "#" ? document.body : document.querySelector(hash);
            if (!target) return;
            event.preventDefault();
            const navHeight = document.getElementById("navbar")?.offsetHeight || 0;
            const targetY = hash === "#" ? 0 : target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
            animateScrollTo(Math.max(targetY, 0));
            history.pushState(null, "", hash);
        });
    });

    const setup = (trackId, leftId, rightId, amount) => {
        const track = document.getElementById(trackId);
        const left = document.getElementById(leftId);
        const right = document.getElementById(rightId);
        if (!track || !left || !right) return;
        const updateButtons = () => {
            const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 0);
            const atStart = track.scrollLeft <= 2;
            const atEnd = track.scrollLeft >= maxScroll - 2;
            left.classList.toggle("is-hidden", atStart || maxScroll <= 2);
            right.classList.toggle("is-hidden", atEnd || maxScroll <= 2);
        };
        left.addEventListener("click", () => track.scrollBy({ left: -amount, behavior: "smooth" }));
        right.addEventListener("click", () => track.scrollBy({ left: amount, behavior: "smooth" }));
        track.addEventListener("scroll", () => window.requestAnimationFrame(updateButtons), { passive: true });
        window.addEventListener("resize", updateButtons);
        window.setTimeout(updateButtons, 0);
        window.setTimeout(updateButtons, 450);
    };
    setup("pub-carousel-track", "pub-scroll-left", "pub-scroll-right", 360);
    setup("appointments-list", "appointments-scroll-left", "appointments-scroll-right", 340);
    setup("education-list", "education-scroll-left", "education-scroll-right", 340);
    setup("funded-project-list", "projects-scroll-left", "projects-scroll-right", 400);
    setup("service-list", "service-scroll-left", "service-scroll-right", 400);
    setup("awards-list", "awards-scroll-left", "awards-scroll-right", 400);
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal, .reveal-scale").forEach((el) => obs.observe(el));
});

