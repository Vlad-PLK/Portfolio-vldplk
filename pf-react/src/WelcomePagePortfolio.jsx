import { useState, useEffect } from "react";

// Typing Effect Component
function TypingEffect({ text, speed = 100, className = "" }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span className="typing-cursor">▊</span>
    </span>
  );
}

// Scroll Indicator Component
function ScrollIndicator() {
  return (
    <div className="scroll-indicator">
      <div className="mouse">
        <div className="wheel"></div>
      </div>
    </div>
  );
}

// Interactive Terminal Component
function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', content: 'Welcome to Vladimir\'s Portfolio Terminal v1.0' },
    { type: 'output', content: 'Type "help" for available commands' },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useState(null);
  const terminalBodyRef = useState(null);

  const commands = {
    help: `Available commands:
  whoami    - Display user information
  ls        - List projects
  skills    - Show technical skills
  contact   - Display contact information
  clear     - Clear terminal
  neofetch  - System information`,
    whoami: `Vladimir Polojienko
DevOps Cloud & Full-Stack Developer
Location: French Riviera, France
Status: Available for freelance work`,
    ls: `total 6 projects
drwxr-xr-x  INCEPTION/       Docker infrastructure
drwxr-xr-x  Transcendence/   3D multiplayer game
drwxr-xr-x  FT-IRC/          IRC Server (C++)
drwxr-xr-x  MINISHELL/       Custom shell
drwxr-xr-x  CUB3D/           3D game engine
drwxr-xr-x  PHILOSOPHERS/    Threading project`,
    skills: `Technical Skills:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DevOps & Cloud    [████████░░] 80%
SysAdmin          [██████░░░░] 75%
Frontend & 3D     [█████░░░░░] 60%
C/C++             [█████████░] 95%`,
    contact: `Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email:    leonpolo365@gmail.com
💼 LinkedIn: vladimir-polojienko-735563307
🐙 GitHub:   github.com/Vlad-PLK
📝 Blog:     vlad-plk.github.io`,
    neofetch: `                       vladpolo@portfolio
       _,met$$$$$gg.     ─────────────────────
    ,g$$$$$$$$$$$$$$$P.  OS: Portfolio v1.0
  ,g$$P"     """Y$$.".   Host: DevOps Portfolio
 ,$$P'              \`$$. Kernel: React 18
',$$P       ,ggs.     \`$$b: Uptime: ${Math.floor(Math.random() * 100)} days
\`d$$'     ,$P"'   .    $$$ Shell: Interactive Terminal
 $$P      d$'     ,    $$P Theme: Neon Cyberpunk
 $$:      $$.   -    ,d$$' Icons: Lucide React
 $$;      Y$b._   _,d$P'   Terminal: Custom
 Y$$.    \`.\`"Y$$$$P"'      ━━━━━━━━━━━━━━━━━━━━
 \`$$b      "-.__          Languages: C/C++, Python, JS
  \`Y$$                    Stack: Docker, React, Django
   \`Y$$.                  ━━━━━━━━━━━━━━━━━━━━
     \`$$b.
       \`Y$$b.
          \`"Y$b._
              \`"""`,
    clear: 'CLEAR',
  };

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (terminalBodyRef[0]) {
      terminalBodyRef[0].scrollTop = terminalBodyRef[0].scrollHeight;
    }
  }, [history]);

  // Focus input on mount and when clicking terminal
  useEffect(() => {
    if (inputRef[0]) {
      inputRef[0].focus();
    }
  }, []);

  const handleTerminalClick = () => {
    if (inputRef[0]) {
      inputRef[0].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    setCommandHistory([...commandHistory, cmd]);
    setHistoryIndex(-1);

    const newHistory = [...history, { type: 'input', content: input }];

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (commands[cmd]) {
      newHistory.push({ type: 'output', content: commands[cmd] });
    } else {
      newHistory.push({ type: 'error', content: `Command not found: ${cmd}. Type 'help' for available commands.` });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="terminal-window" onClick={handleTerminalClick}>
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-btn close"></span>
          <span className="terminal-btn minimize"></span>
          <span className="terminal-btn maximize"></span>
        </div>
        <span className="terminal-title">terminal</span>
      </div>
      <div className="terminal-body" ref={(el) => { terminalBodyRef[0] = el; }}>
        {history.map((line, index) => (
          <div key={index} className={`terminal-line ${line.type}`}>
            {line.type === 'input' && (
              <span className="terminal-prompt">visitor@portfolio:~$ </span>
            )}
            <span className="terminal-content">{line.content}</span>
          </div>
        ))}
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="terminal-prompt">visitor@portfolio:~$ </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            ref={(el) => { inputRef[0] = el; }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </form>
      </div>
    </div>
  );
}

// Metrics Dashboard Component
function MetricCard({ icon, label, value, color = "cyan" }) {
  return (
    <div className={`metric-card metric-${color}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <div className="metric-value">{value}</div>
        <div className="metric-label">{label}</div>
      </div>
    </div>
  );
}

function WelcomePagePortfolio() {
  const [activeSection, setActiveSection] = useState('hero');
  const [uptime, setUptime] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setUptime({
        days: Math.floor(elapsed / (1000 * 60 * 60 * 24)),
        hours: Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60)),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      id: "a3f5d9e2",
      name: "INCEPTION",
      image: "debian:bullseye",
      status: "running",
      description: "Full web infrastructure with Docker Compose, NGINX, WordPress & MariaDB",
      tech: ["Docker", "Docker-Compose", "NGINX", "MariaDB", "WordPress"],
      ports: "80:80, 443:443",
      uptime: "24h",
      link: "https://github.com/Vlad-PLK/INCEPTION",
    },
    {
      id: "b7e2c4f1",
      name: "Transcendence",
      image: "node:18:alpine",
      status: "running",
      description: "3D Pong game with Three.js, React as Frontend, Django & WebSockets",
      tech: ["React", "Django", "Three.js"],
      ports: "8000:8000",
      uptime: "18h",
      link: "https://github.com/Vlad-PLK/Transcendence",
    },
    {
      id: "c9a1f3d5",
      name: "FT-IRC",
      image: "cpp:server",
      status: "running",
      description: "Complete IRC Server implementation from scratch in C++",
      tech: ["C++", "Networking", "Protocols"],
      ports: "6667:6667",
      uptime: "72h",
      link: "https://github.com/Vlad-PLK/Internet-Relay-Chat",
    },
    {
      id: "d4b8e2a6",
      name: "MINISHELL",
      image: "alpine:shell",
      status: "running",
      description: "Bash-like shell with pipes, builtins, redirections & process management",
      tech: ["C", "Linux", "Systems"],
      ports: "N/A",
      uptime: "120h",
      link: "https://github.com/Vlad-PLK/MINISHELL",
    },
    {
      id: "e6c3f9b2",
      name: "CUB3D",
      image: "c:graphics",
      status: "running",
      description: "Raycasting 3D game engine coded from scratch in C, inspired by Wolfenstein 3D",
      tech: ["C", "Graphics", "Raycasting", "Algorithms"],
      ports: "N/A",
      uptime: "96h",
      link: "https://github.com/Vlad-PLK/CUB_3D",
    },
    {
      id: "f2d7a4c8",
      name: "PHILOSOPHERS",
      image: "c:threads",
      status: "running",
      description: "Solving the dining philosophers problem with multithreading in C",
      tech: ["C", "Threads", "Concurrency"],
      ports: "N/A",
      uptime: "48h",
      link: "https://github.com/Vlad-PLK/PHILOSOPHER",
    }
  ];

  const skills = [
    {
      category: "DevOps & Cloud",
      icon: "☁️",
      items: [
        { name: "Docker", level: 90 },
        { name: "Kubernetes", level: 70 },
        { name: "CI/CD", level: 80 },
        { name: "AWS", level: 65 },
        { name: "IaC", level: 65 },
      ]
    },
    {
      category: "Backend & Systems",
      icon: "⚙️",
      items: [
        { name: "Django", level: 60 },
        { name: "REST APIs", level: 90 },
        { name: "PostgreSQL", level: 80 },
        { name: "Redis", level: 65 },
        { name: "Linux/Unix", level: 95 },
      ]
    },
    {
      category: "Frontend & 3D",
      icon: "🎨",
      items: [
        { name: "React 18", level: 85 },
        { name: "Three.js", level: 65 },
        { name: "Vite", level: 80 },
        { name: "Bootstrap", level: 85 },
      ]
    },
    {
      category: "Languages",
      icon: "💻",
      items: [
        { name: "C/C++", level: 95 },
        { name: "Python", level: 70 },
        { name: "JavaScript", level: 85 },
        { name: "Bash/Shell", level: 90 },
        { name: "SQL", level: 65 },
      ]
    }
  ];

  return (
    <>
      <div className="portfolio-wrapper">
        {/* Fixed Navigation */}
        <nav className="portfolio-nav">
          <div className="nav-brand">
            <span className="brand-text">VP</span>
          </div>
          <div className="nav-links">
            <a href="#hero" className={activeSection === 'hero' ? 'active' : ''}>Home</a>
            <a href="#about" className={activeSection === 'about' ? 'active' : ''}>About</a>
            <a href="#skills" className={activeSection === 'skills' ? 'active' : ''}>Skills</a>
            <a href="#projects" className={activeSection === 'projects' ? 'active' : ''}>Projects</a>
            <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>Contact</a>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="hero" className="portfolio-section hero-section">
          <div className="hero-grid">
            <div className="hero-left">
              <span className="hero-greeting">Hello, I'm</span>
              <h1 className="hero-title">
                Vladimir Polojienko
              </h1>
              <h2 className="hero-subtitle">
                <TypingEffect text="DevOps & Full-Stack Freelance Developer" speed={80} />
              </h2>
              <p className="hero-description">
                Building robust cloud infrastructure, automating workflows, and crafting modern web experiences.
                Currently into DevOps, Kubernetes and containerization.
              </p>

              {/* Metrics Grid */}
              <div className="metrics-grid">
                <MetricCard
                  icon="⏱️"
                  label="Session Uptime"
                  value={`${uptime.hours}h ${uptime.minutes}m`}
                  color="cyan"
                />
                <MetricCard
                  icon="📦"
                  label="Projects"
                  value="15+"
                  color="purple"
                />
                <MetricCard
                  icon="🐳"
                  label="Containers Running"
                  value={projects.length}
                  color="pink"
                />
                <MetricCard
                  icon="☕"
                  label="Coffee Consumed"
                  value="∞"
                  color="green"
                />
              </div>

              <div className="hero-cta">
                <a href="#projects" className="btn-primary">View My Work</a>
                <a href="#contact" className="btn-secondary">Get In Touch</a>
              </div>
            </div>

            <div className="hero-right">
              <Terminal />
            </div>
          </div>
          <ScrollIndicator />
        </section>

        {/* About Section */}
        <section id="about" className="portfolio-section about-section">
          <div className="section-container">
            <h2 className="section-title">
              <span className="title-prompt">$ cat</span> about.md
            </h2>
            <div className="about-content">
              <div className="about-card">
                <div className="about-text">
                  <p className="about-paragraph">
                    I'm a young developer living on the French Riviera, working as a freelance developer and entrepreneur.
                    My journey into programming began as a lot of kids, in middle school trying to code websites with HTML/CSS, then exploring Python, building games with PyGames and algorithms. As time goes, I continued to learn and grow, and in 2022,
                    my adventure continues at <strong>42 Nice</strong>, where I successfully completed the intense "piscine" month selection process and dove deep
                    into computer science fundamentals. The peer-to-peer learning model at 42 has been a game-changer, pushing me to collaborate, innovate, and think critically. It's here that I honed my skills in C and C++, mastering low-level programming, memory management, and algorithmic thinking.
                    The experience has been both challenging and rewarding, shaping me into a versatile developer ready to tackle complex problems. I have built strong foundations in software engineering principles and best practices.
                  </p>
                  <p className="about-paragraph">
                    After completing the common core in mid-2024, I joined <strong>Etherscore</strong>, a blockchain startup,
                    for my first internship. I worked as a Blockchain Data Developer and my job was to analyse onchain data to then create so-called "subgraphs", which are a way to organize and query blockchain data efficiently.
                    I loved my time at Etherscore. It was a great learning experience and I sharpened my understanding of blockchain technology. Now, I've finished most of 42 cursus and so my internship with success and I decided
                    to launch my own freelance career. I want to live a life of dreams, personnal projects and independancy. I realised that the DevOps field, system administration, linux and more should be the next great goal to reach for my carreer.
                    That's why I'm transitioning into <strong>DevOps and Cloud Engineering</strong>, combining
                    my strong C/C++ and web development background with modern DevOps practices.
                  </p>
                  <p className="about-paragraph">
                    I decided to go freelance to create my own path and explore everything programming has to offer.
                    Check out my <a href="https://vlad-plk.github.io" target="_blank" rel="noopener noreferrer" className="inline-link">blog</a> where
                    I document my coding journey as much as it goes. I'm excited about the future and eager to see where this path takes me!
                  </p>
                </div>
                <div className="about-highlights">
                  <div className="highlight-item">
                    <div className="highlight-icon">🎓</div>
                    <div className="highlight-text">
                      <strong>42 Nice School</strong>
                      <span>2022 - 2025</span>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <div className="highlight-icon">💼</div>
                    <div className="highlight-text">
                      <strong>Etherscore Internship</strong>
                      <span>Blockchain Startup : <a href="https://etherscore.network" target="_blank" rel="noopener noreferrer" className="inline-link">etherscore.network</a> </span>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <div className="highlight-icon">🚀</div>
                    <div className="highlight-text">
                      <strong>Freelance DevOps</strong>
                      <span>2024 - Present</span>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <div className="highlight-icon">📍</div>
                    <div className="highlight-text">
                      <strong>Location</strong>
                      <span>French Riviera, France</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ScrollIndicator />
        </section>

        {/* Skills Section */}
        <section id="skills" className="portfolio-section skills-section">
          <div className="section-container">
            <h2 className="section-title">
              <span className="title-prompt">$ ls</span> skills/
            </h2>
            <div className="skills-grid">
              {skills.map((skillGroup, index) => (
                <div key={index} className="skill-card">
                  <div className="skill-header">
                    <span className="skill-icon">{skillGroup.icon}</span>
                    <h3 className="skill-category">{skillGroup.category}</h3>
                  </div>
                  <div className="skill-items">
                    {skillGroup.items.map((item, idx) => (
                      <div key={idx} className="skill-item">
                        <div className="skill-item-header">
                          <span className="skill-name">{item.name}</span>
                          <span className="skill-percentage">{item.level}%</span>
                        </div>
                        <div className="skill-progress-bar">
                          <div
                            className="skill-progress-fill"
                            style={{ width: `${item.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ScrollIndicator />
        </section>

        {/* Projects Section - Docker Style */}
        <section id="projects" className="portfolio-section projects-section">
          <div className="section-container">
            <h2 className="section-title">
              <span className="title-prompt">$ docker ps</span>
            </h2>
            <div className="docker-header">
              <span>CONTAINER ID</span>
              <span>IMAGE</span>
              <span>STATUS</span>
              <span>PORTS</span>
            </div>
            <div className="projects-grid">
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="docker-card"
                >
                  <div className="docker-card-header">
                    <div className="docker-card-id">
                      <span className="container-id">{project.id}</span>
                      <span className="container-image">{project.image}</span>
                    </div>
                    <div className="docker-status">
                      <span className="status-dot"></span>
                      <span className="status-text">{project.status}</span>
                      <span className="status-uptime">{project.uptime}</span>
                    </div>
                  </div>
                  <div className="docker-card-content">
                    <h3 className="docker-card-name">{project.name}</h3>
                    <p className="docker-card-description">{project.description}</p>
                    <div className="docker-card-ports">
                      <span className="port-label">PORTS:</span>
                      <span className="port-value">{project.ports}</span>
                    </div>
                    <div className="docker-card-tech">
                      {project.tech.map((tech, idx) => (
                        <span key={idx} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="docker-card-footer">
                    <span>→ View on GitHub</span>
                  </div>
                </a>
              ))}
            </div>
            <div className="projects-cta">
              <a
                href="https://github.com/Vlad-PLK?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-view-all"
              >
                $ git clone --all →
              </a>
            </div>
          </div>
          <ScrollIndicator />
        </section>

        {/* Contact Section */}
        <section id="contact" className="portfolio-section contact-section">
          <div className="section-container">
            <h2 className="section-title">
              <span className="title-prompt">$ ./deploy</span> contact.sh
            </h2>
            <div className="contact-content">
              <p className="contact-intro">
                I'm always open to new opportunities, collaborations, and interesting projects.
                Whether you're looking for a DevOps engineer, a full-stack developer, or just want to chat about tech,
                feel free to reach out!
              </p>
              <div className="contact-grid">
                <a href="mailto:leonpolo365@gmail.com" className="contact-card">
                  <div className="contact-icon">📧</div>
                  <h3>Email</h3>
                  <p>leonpolo365@gmail.com</p>
                  <div className="contact-hover-effect"></div>
                </a>
                <a href="https://www.linkedin.com/in/vladimir-polojienko-735563307" target="_blank" rel="noopener noreferrer" className="contact-card">
                  <div className="contact-icon">💼</div>
                  <h3>LinkedIn</h3>
                  <p>Connect with me</p>
                  <div className="contact-hover-effect"></div>
                </a>
                <a href="https://github.com/Vlad-PLK" target="_blank" rel="noopener noreferrer" className="contact-card">
                  <div className="contact-icon">🐙</div>
                  <h3>GitHub</h3>
                  <p>Check out my code</p>
                  <div className="contact-hover-effect"></div>
                </a>
                <a href="https://vlad-plk.github.io" target="_blank" rel="noopener noreferrer" className="contact-card">
                  <div className="contact-icon">📝</div>
                  <h3>Blog</h3>
                  <p>Read my journey</p>
                  <div className="contact-hover-effect"></div>
                </a>
              </div>
            </div>

            {/* Footer */}
            <footer className="portfolio-footer">
              <div className="footer-content">
                <p className="footer-copyright">© 2025 Vladimir Polojienko • Crafted with ☕ and ❤️</p>
                <p className="footer-tagline">MyStartTech - Your tech project starts here</p>
                <p className="footer-version">v1.0.0</p>
              </div>
            </footer>
          </div>
        </section>
      </div>

      {/* Global Styles */}
      <style>{`
        /* Custom Font Declarations - Yapari */
        @font-face {
          font-family: 'Yapari';
          src: url('/yapari/YapariTrial-Regular.ttf') format('truetype');
          font-weight: 400;
          font-style: normal;
        }

        @font-face {
          font-family: 'Yapari';
          src: url('/yapari/YapariTrial-Medium.ttf') format('truetype');
          font-weight: 500;
          font-style: normal;
        }

        @font-face {
          font-family: 'Yapari';
          src: url('/yapari/YapariTrial-SemiBold.ttf') format('truetype');
          font-weight: 600;
          font-style: normal;
        }

        @font-face {
          font-family: 'Yapari';
          src: url('/yapari/YapariTrial-Bold.ttf') format('truetype');
          font-weight: 700;
          font-style: normal;
        }

        @font-face {
          font-family: 'Yapari';
          src: url('/yapari/YapariTrial-ExtraBold.ttf') format('truetype');
          font-weight: 800;
          font-style: normal;
        }

        @font-face {
          font-family: 'Yapari';
          src: url('/yapari/YapariTrial-Ultra.ttf') format('truetype');
          font-weight: 900;
          font-style: normal;
        }

        /* Custom Font Declarations - Noto Sans Mono */
        @font-face {
          font-family: 'Noto Sans Mono';
          src: url('/Noto_Sans_Mono/static/NotoSansMono-Light.ttf') format('truetype');
          font-weight: 300;
          font-style: normal;
        }

        @font-face {
          font-family: 'Noto Sans Mono';
          src: url('/Noto_Sans_Mono/static/NotoSansMono-Regular.ttf') format('truetype');
          font-weight: 400;
          font-style: normal;
        }

        @font-face {
          font-family: 'Noto Sans Mono';
          src: url('/Noto_Sans_Mono/static/NotoSansMono-Medium.ttf') format('truetype');
          font-weight: 500;
          font-style: normal;
        }

        @font-face {
          font-family: 'Noto Sans Mono';
          src: url('/Noto_Sans_Mono/static/NotoSansMono-SemiBold.ttf') format('truetype');
          font-weight: 600;
          font-style: normal;
        }

        @font-face {
          font-family: 'Noto Sans Mono';
          src: url('/Noto_Sans_Mono/static/NotoSansMono-Bold.ttf') format('truetype');
          font-weight: 700;
          font-style: normal;
        }

        /* Global Reset & Base */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          font-family: 'Noto Sans Mono', monospace, -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #0f172a;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #22d3ee, #a855f7);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #06b6d4, #7c3aed);
        }

        /* Selection Color */
        ::selection {
          background: rgba(34, 211, 238, 0.3);
          color: #e2e8f0;
        }

        ::-moz-selection {
          background: rgba(34, 211, 238, 0.3);
          color: #e2e8f0;
        }

        /* Portfolio Wrapper */
        .portfolio-wrapper {
          background: linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a);
          min-height: 100vh;
          color: #e2e8f0;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        /* Navigation */
        .portfolio-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 5%;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 2px solid rgba(34, 211, 238, 0.2);
        }

        .nav-brand .brand-text {
          font-size: 2rem;
          background: linear-gradient(to right, #22d3ee, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 900;
          font-family: 'Yapari', sans-serif;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          font-family: 'Noto Sans Mono', monospace;
          transition: all 0.3s ease;
          position: relative;
          padding: 0.5rem 0;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(to right, #22d3ee, #a855f7);
          transition: width 0.3s ease;
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: #22d3ee;
        }

        .nav-links a:hover::after,
        .nav-links a.active::after {
          width: 100%;
        }

        /* Section Base */
        .portfolio-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 5% 80px;
          position: relative;
        }

        .section-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        .section-title {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 4rem;
          background: linear-gradient(to right, #22d3ee, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Yapari', sans-serif;
          font-weight: 800;
        }

        .title-prompt {
          color: #10b981;
          font-family: 'Noto Sans Mono', monospace;
          font-size: 2rem;
          margin-right: 0.5rem;
          font-weight: 600;
        }

        /* Hero Section */
        .hero-section {
          padding-top: 140px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-greeting {
          font-size: 1.5rem;
          color: #22d3ee;
          margin-bottom: 1rem;
          font-weight: 500;
          font-family: 'Noto Sans Mono', monospace;
        }

        .hero-title {
          font-size: 4rem;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #22d3ee, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
          font-family: 'Yapari', sans-serif;
          font-weight: 900;
        }

        .hero-subtitle {
          font-size: 2rem;
          color: #e2e8f0;
          margin-bottom: 2rem;
          min-height: 60px;
          font-family: 'Yapari', sans-serif;
          font-weight: 700;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #94a3b8;
          line-height: 1.8;
          margin-bottom: 3rem;
          font-family: 'Noto Sans Mono', monospace;
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: rgba(15, 23, 42, 0.9);
          border: 2px solid;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .metric-card.metric-cyan {
          border-color: rgba(34, 211, 238, 0.3);
        }

        .metric-card.metric-purple {
          border-color: rgba(168, 85, 247, 0.3);
        }

        .metric-card.metric-pink {
          border-color: rgba(236, 72, 153, 0.3);
        }

        .metric-card.metric-green {
          border-color: rgba(16, 185, 129, 0.3);
        }

        .metric-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(34, 211, 238, 0.2);
        }

        .metric-card.metric-cyan:hover {
          border-color: #22d3ee;
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
        }

        .metric-card.metric-purple:hover {
          border-color: #a855f7;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
        }

        .metric-card.metric-pink:hover {
          border-color: #ec4899;
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
        }

        .metric-card.metric-green:hover {
          border-color: #10b981;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }

        .metric-icon {
          font-size: 2rem;
        }

        .metric-content {
          display: flex;
          flex-direction: column;
        }

        .metric-value {
          font-family: 'Noto Sans Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #e2e8f0;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Noto Sans Mono', monospace;
        }

        /* CTA Buttons */
        .hero-cta {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.3s ease;
          font-family: 'Yapari', sans-serif;
        }

        .btn-primary {
          background: linear-gradient(to right, #22d3ee, #a855f7);
          color: white;
          border: none;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(34, 211, 238, 0.4);
          background: linear-gradient(to right, #06b6d4, #7c3aed);
        }

        .btn-secondary {
          background: transparent;
          color: #22d3ee;
          border: 2px solid #22d3ee;
        }

        .btn-secondary:hover {
          background: rgba(34, 211, 238, 0.1);
          transform: translateY(-3px);
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
        }

        /* Terminal Component */
        .terminal-window {
          background: #0f172a;
          border: 2px solid rgba(34, 211, 238, 0.5);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          cursor: text;
        }

        .terminal-header {
          background: #1e293b;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .terminal-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .terminal-btn {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .terminal-btn.close {
          background: #ff5f56;
        }

        .terminal-btn.minimize {
          background: #ffbd2e;
        }

        .terminal-btn.maximize {
          background: #27c93f;
        }

        .terminal-title {
          font-family: 'Noto Sans Mono', monospace;
          font-size: 0.9rem;
          color: #64748b;
        }

        .terminal-body {
          padding: 1.5rem;
          font-family: 'Noto Sans Mono', monospace;
          font-size: 0.9rem;
          height: 400px;
          overflow-y: auto;
          line-height: 1.6;
        }

        .terminal-line {
          margin-bottom: 0.5rem;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .terminal-line.output {
          color: #e2e8f0;
        }

        .terminal-line.error {
          color: #ff5f56;
        }

        .terminal-prompt {
          color: #10b981;
          font-weight: 600;
        }

        .terminal-content {
          color: #e2e8f0;
        }

        .terminal-input-line {
          display: flex;
          align-items: center;
        }

        .terminal-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #e2e8f0;
          font-family: 'Noto Sans Mono', monospace;
          font-size: 0.9rem;
          padding: 0;
          caret-color: #22d3ee;
          min-width: 50px;
        }

        .terminal-input:focus {
          outline: none;
        }

        /* Typing Cursor */
        .typing-cursor {
          animation: blink 1s infinite;
          color: #22d3ee;
          font-weight: 400;
        }

        @keyframes blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }

        /* About Section */
        .about-section {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.6) 100%);
        }

        .about-card {
          background: rgba(15, 23, 42, 0.9);
          border: 2px solid rgba(34, 211, 238, 0.3);
          border-radius: 12px;
          padding: 3rem;
          backdrop-filter: blur(10px);
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          transition: all 0.3s ease;
        }

        .about-card:hover {
          border-color: rgba(34, 211, 238, 0.6);
          box-shadow: 0 0 40px rgba(34, 211, 238, 0.2);
        }

        .about-paragraph {
          font-size: 1.1rem;
          line-height: 1.9;
          color: #94a3b8;
          margin-bottom: 1.5rem;
          font-family: 'Noto Sans Mono', monospace;
        }

        .about-paragraph strong {
          color: #22d3ee;
          font-weight: 700;
          font-family: 'Yapari', sans-serif;
        }

        .inline-link {
          color: #a855f7;
          text-decoration: none;
          border-bottom: 1px solid #a855f7;
          transition: all 0.3s ease;
        }

        .inline-link:hover {
          color: #22d3ee;
          border-bottom-color: #22d3ee;
        }

        .about-highlights {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(34, 211, 238, 0.05);
          border-radius: 8px;
          border: 2px solid rgba(34, 211, 238, 0.2);
          transition: all 0.3s ease;
        }

        .highlight-item:hover {
          background: rgba(34, 211, 238, 0.1);
          border-color: rgba(34, 211, 238, 0.5);
          transform: translateX(10px);
        }

        .highlight-icon {
          font-size: 2rem;
          min-width: 50px;
          text-align: center;
        }

        .highlight-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .highlight-text strong {
          color: #e2e8f0;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'Yapari', sans-serif;
        }

        .highlight-text span {
          color: #94a3b8;
          font-size: 0.9rem;
          font-family: 'Noto Sans Mono', monospace;
        }

        /* Skills Section */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .skill-card {
          background: rgba(15, 23, 42, 0.9);
          border: 2px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .skill-card:hover {
          transform: translateY(-5px);
          border-color: rgba(168, 85, 247, 0.6);
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.3);
        }

        .skill-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .skill-icon {
          font-size: 2rem;
        }

        .skill-category {
          font-size: 1.5rem;
          color: #a855f7;
          font-family: 'Yapari', sans-serif;
          font-weight: 800;
        }

        .skill-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .skill-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .skill-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skill-name {
          color: #e2e8f0;
          font-weight: 500;
          font-family: 'Noto Sans Mono', monospace;
        }

        .skill-percentage {
          font-family: 'Noto Sans Mono', monospace;
          color: #22d3ee;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .skill-progress-bar {
          height: 6px;
          background: #1e293b;
          border-radius: 3px;
          overflow: hidden;
        }

        .skill-progress-fill {
          height: 100%;
          background: linear-gradient(to right, #22d3ee, #a855f7);
          border-radius: 3px;
          transition: width 1s ease;
        }

        /* Docker Container Cards */
        .docker-header {
          display: grid;
          grid-template-columns: 1fr 1.5fr 0.8fr 1fr;
          gap: 1rem;
          padding: 1rem;
          background: rgba(15, 23, 42, 0.9);
          border: 2px solid rgba(34, 211, 238, 0.3);
          border-radius: 8px;
          margin-bottom: 2rem;
          font-family: 'Noto Sans Mono', monospace;
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 2rem;
        }

        .docker-card {
          background: rgba(15, 23, 42, 0.9);
          border: 2px solid rgba(34, 211, 238, 0.3);
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .docker-card:hover {
          border-color: #22d3ee;
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.3);
          transform: translateY(-5px);
        }

        .docker-card-header {
          padding: 1rem 1.5rem;
          background: rgba(30, 41, 59, 0.8);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(34, 211, 238, 0.2);
        }

        .docker-card-id {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .container-id {
          font-family: 'Noto Sans Mono', monospace;
          color: #22d3ee;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .container-image {
          font-family: 'Noto Sans Mono', monospace;
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .docker-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .status-text {
          color: #10b981;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .status-uptime {
          font-family: 'Noto Sans Mono', monospace;
          color: #64748b;
          font-size: 0.8rem;
        }

        .docker-card-content {
          padding: 1.5rem;
        }

        .docker-card-name {
          font-size: 1.5rem;
          color: #a855f7;
          margin-bottom: 0.75rem;
          font-family: 'Yapari', sans-serif;
          font-weight: 800;
        }

        .docker-card-description {
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          font-family: 'Noto Sans Mono', monospace;
        }

        .docker-card-ports {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-family: 'Noto Sans Mono', monospace;
          font-size: 0.85rem;
        }

        .port-label {
          color: #64748b;
        }

        .port-value {
          color: #22d3ee;
        }

        .docker-card-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tech-tag {
          background: rgba(34, 211, 238, 0.1);
          color: #22d3ee;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.8rem;
          border: 1px solid rgba(34, 211, 238, 0.3);
          font-family: 'Noto Sans Mono', monospace;
          font-weight: 600;
        }

        .docker-card-footer {
          padding: 1rem 1.5rem;
          background: rgba(30, 41, 59, 0.8);
          border-top: 1px solid rgba(34, 211, 238, 0.2);
          color: #22d3ee;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .projects-cta {
          text-align: center;
          margin-top: 3rem;
        }

        .btn-view-all {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: transparent;
          border: 2px solid #a855f7;
          color: #a855f7;
          text-decoration: none;
          border-radius: 4px;
          font-size: 1.1rem;
          font-family: 'Noto Sans Mono', monospace;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .btn-view-all:hover {
          background: rgba(168, 85, 247, 0.1);
          border-color: #22d3ee;
          color: #22d3ee;
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
        }

        /* Contact Section */
        .contact-intro {
          font-size: 1.2rem;
          color: #94a3b8;
          text-align: center;
          line-height: 1.8;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          font-family: 'Noto Sans Mono', monospace;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .contact-card {
          background: rgba(15, 23, 42, 0.9);
          border: 2px solid rgba(236, 72, 153, 0.3);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .contact-card:hover {
          transform: translateY(-10px);
          border-color: #ec4899;
          box-shadow: 0 0 30px rgba(236, 72, 153, 0.3);
        }

        .contact-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .contact-card h3 {
          color: #ec4899;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          font-family: 'Yapari', sans-serif;
          font-weight: 700;
        }

        .contact-card p {
          color: #94a3b8;
          font-size: 0.95rem;
          font-family: 'Noto Sans Mono', monospace;
        }

        /* Footer */
        .portfolio-footer {
          margin-top: 5rem;
          padding: 2rem 0;
          border-top: 2px solid rgba(34, 211, 238, 0.2);
        }

        .footer-content {
          text-align: center;
        }

        .footer-copyright {
          color: #94a3b8;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
          font-family: 'Noto Sans Mono', monospace;
        }

        .footer-tagline {
          color: #22d3ee;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          font-family: 'Yapari', sans-serif;
          font-weight: 700;
        }

        .footer-version {
          color: #64748b;
          font-size: 0.8rem;
          font-family: 'Noto Sans Mono', monospace;
        }

        /* Scroll Indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .mouse {
          width: 25px;
          height: 40px;
          border: 2px solid #22d3ee;
          border-radius: 20px;
          position: relative;
        }

        .wheel {
          width: 3px;
          height: 8px;
          background: #22d3ee;
          border-radius: 2px;
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          animation: scroll-wheel 1.5s infinite;
        }

        @keyframes scroll-wheel {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(15px);
          }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .terminal-window {
            max-width: 100%;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 968px) {
          .hero-title {
            font-size: 3rem;
          }

          .hero-subtitle {
            font-size: 1.5rem;
          }

          .about-card {
            grid-template-columns: 1fr;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .docker-header {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            gap: 1rem;
            font-size: 0.85rem;
          }

          .portfolio-section {
            padding: 100px 5% 60px;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .skill-card,
          .docker-card {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .nav-links {
            display: none;
          }

          .hero-title {
            font-size: 2rem;
          }

          .about-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}

export default WelcomePagePortfolio;
