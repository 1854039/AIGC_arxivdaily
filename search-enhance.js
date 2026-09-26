// 搜索和筛选增强功能
class SearchEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addSearchBar();
        this.addFilters();
        this.addKeyboardShortcuts();
        this.addReadingStatus();
        this.addQuickActions();
    }

    addSearchBar() {
        const header = document.querySelector('.header-container');
        const searchHTML = `
            <div class="search-container" style="margin: 16px 0;">
                <div class="search-box">
                    <input type="text" id="global-search" placeholder="🔍 搜索论文标题、作者、关键词..." 
                           style="width: 100%; padding: 12px 16px; border: 2px solid #e1e8ed; border-radius: 25px; font-size: 16px; outline: none;">
                    <div class="search-filters" style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="filter-btn active" data-filter="all">全部</button>
                        <button class="filter-btn" data-filter="highlighted">高亮论文</button>
                        <button class="filter-btn" data-filter="updated">更新论文</button>
                        <button class="filter-btn" data-filter="unread">未读</button>
                        <button class="filter-btn" data-filter="starred">收藏</button>
                    </div>
                </div>
            </div>
        `;
        
        header.insertAdjacentHTML('afterend', searchHTML);
        
        // 搜索功能
        const searchInput = document.getElementById('global-search');
        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        // 筛选功能
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.applyFilter(e.target.dataset.filter);
            });
        });
    }

    addFilters() {
        // 添加筛选样式
        const style = document.createElement('style');
        style.textContent = `
            .filter-btn {
                padding: 6px 12px;
                border: 1px solid #ddd;
                border-radius: 16px;
                background: white;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            
            .filter-btn:hover {
                background: #f0f0f0;
            }
            
            .filter-btn.active {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }
            
            .paper-hidden {
                display: none !important;
            }
            
            .reading-status {
                display: inline-flex;
                gap: 8px;
                margin-top: 8px;
            }
            
            .status-btn {
                padding: 4px 8px;
                border: 1px solid #ddd;
                border-radius: 12px;
                background: white;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
            }
            
            .status-btn.read {
                background: #4caf50;
                color: white;
                border-color: #4caf50;
            }
            
            .status-btn.starred {
                background: #ffc107;
                color: white;
                border-color: #ffc107;
            }
            
            .quick-actions {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                z-index: 1000;
            }
            
            .quick-action-btn {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                border: none;
                background: #667eea;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            }
            
            .quick-action-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
            
            .stats-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 12px;
                padding: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                z-index: 999;
                display: none;
                min-width: 200px;
            }
            
            .stats-panel h3 {
                margin-top: 0;
            }
            
            .stats-panel button {
                margin-top: 12px;
                padding: 8px 16px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }

    performSearch(query) {
        const papers = document.querySelectorAll('.article-expander');
        
        if (!query.trim()) {
            papers.forEach(paper => paper.closest('article').classList.remove('paper-hidden'));
            this.updateResultsCount();
            return;
        }

        const searchTerms = query.toLowerCase().split(' ');
        
        papers.forEach(paper => {
            const title = paper.querySelector('.article-expander-title').textContent.toLowerCase();
            const authors = paper.querySelector('.article-authors').textContent.toLowerCase();
            const summaryElement = paper.querySelector('.article-summary-box-inner span');
            const summary = summaryElement ? summaryElement.textContent.toLowerCase() : '';
            
            const searchText = `${title} ${authors} ${summary}`;
            const matches = searchTerms.every(term => searchText.includes(term));
            
            paper.closest('article').classList.toggle('paper-hidden', !matches);
        });
        
        this.updateResultsCount();
    }

    applyFilter(filterType) {
        const papers = document.querySelectorAll('.article-expander');
        
        papers.forEach(paper => {
            const paperElement = paper.closest('article');
            let shouldShow = true;
            
            switch(filterType) {
                case 'highlighted':
                    shouldShow = paper.querySelector('.highlight-title, .highlight-author') !== null;
                    break;
                case 'updated':
                    shouldShow = paper.querySelector('.article-expander-title').textContent.includes('♻');
                    break;
                case 'unread':
                    shouldShow = !this.isRead(paper);
                    break;
                case 'starred':
                    shouldShow = this.isStarred(paper);
                    break;
                case 'all':
                default:
                    shouldShow = true;
                    break;
            }
            
            paperElement.classList.toggle('paper-hidden', !shouldShow);
        });
        
        this.updateResultsCount();
    }

    addReadingStatus() {
        document.querySelectorAll('.article-expander').forEach(paper => {
            const paperId = this.getPaperId(paper);
            const statusHTML = `
                <div class="reading-status">
                    <button class="status-btn read-btn" data-paper-id="${paperId}" title="标记为已读">
                        未读
                    </button>
                    <button class="status-btn star-btn" data-paper-id="${paperId}" title="收藏">
                        ☆
                    </button>
                </div>
            `;
            
            const summaryBox = paper.querySelector('.article-summary-box-inner');
            if (summaryBox) {
                summaryBox.insertAdjacentHTML('afterend', statusHTML);
                
                // 恢复状态
                this.restoreStatus(paper, paperId);
            }
        });

        // 添加状态切换监听
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('read-btn')) {
                this.toggleReadStatus(e.target);
            } else if (e.target.classList.contains('star-btn')) {
                this.toggleStarStatus(e.target);
            }
        });
    }

    addQuickActions() {
        const quickActionsHTML = `
            <div class="quick-actions">
                <button class="quick-action-btn" id="scroll-top" title="回到顶部">
                    ↑
                </button>
                <button class="quick-action-btn" id="expand-all" title="展开/收起所有">
                    ⇅
                </button>
                <button class="quick-action-btn" id="show-stats" title="显示统计">
                    📊
                </button>
                <button class="quick-action-btn" id="export-data" title="导出数据">
                    💾
                </button>
            </div>
            
            <div class="stats-panel" id="stats-panel">
                <h3>📊 论文统计</h3>
                <div id="stats-content"></div>
                <button onclick="document.getElementById('stats-panel').style.display='none'">关闭</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', quickActionsHTML);
        
        // 快捷操作
        document.getElementById('scroll-top').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        document.getElementById('expand-all').addEventListener('click', () => {
            this.toggleExpandAll();
        });
        
        document.getElementById('show-stats').addEventListener('click', () => {
            this.showStats();
        });
        
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + F 聚焦搜索框
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                const searchBox = document.getElementById('global-search');
                if (searchBox) {
                    searchBox.focus();
                }
            }
            
            // Ctrl/Cmd + E 展开/收起所有
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                this.toggleExpandAll();
            }
        });
    }

    toggleExpandAll() {
        const details = document.querySelectorAll('details');
        const isAnyOpen = Array.from(details).some(d => d.open);
        
        details.forEach(detail => {
            detail.open = !isAnyOpen;
        });
    }

    showStats() {
        const papers = document.querySelectorAll('.article-expander');
        const totalPapers = papers.length;
        const readPapers = Array.from(papers).filter(p => this.isRead(p)).length;
        const starredPapers = Array.from(papers).filter(p => this.isStarred(p)).length;
        const highlightedPapers = Array.from(papers).filter(p => 
            p.querySelector('.highlight-title, .highlight-author')).length;
        
        const readingProgress = totalPapers > 0 ? Math.round(readPapers/totalPapers*100) : 0;
        
        const statsContent = `
            <p><strong>📄 总论文数:</strong> ${totalPapers}</p>
            <p><strong>✅ 已读:</strong> ${readPapers}</p>
            <p><strong>⭐ 收藏:</strong> ${starredPapers}</p>
            <p><strong>🔥 高亮:</strong> ${highlightedPapers}</p>
            <p><strong>📈 阅读进度:</strong> ${readingProgress}%</p>
        `;
        
        document.getElementById('stats-content').innerHTML = statsContent;
        document.getElementById('stats-panel').style.display = 'block';
    }

    exportData() {
        const papers = Array.from(document.querySelectorAll('.article-expander')).map(paper => {
            const titleElement = paper.querySelector('.article-expander-title');
            const authorsElement = paper.querySelector('.article-authors');
            const summaryElement = paper.querySelector('.article-summary-box-inner span');
            const linkElement = paper.querySelector('a[href*="arxiv"]');
            
            return {
                title: titleElement ? titleElement.textContent.replace(/^[♻★☆]\s*/, '').trim() : '',
                authors: authorsElement ? authorsElement.textContent.replace(/📄|🔗/g, '').trim() : '',
                summary: summaryElement ? summaryElement.textContent.trim() : '',
                link: linkElement ? linkElement.href : '',
                isRead: this.isRead(paper),
                isStarred: this.isStarred(paper)
            };
        });
        
        const dataStr = JSON.stringify(papers, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `myarxiv-papers-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // 辅助方法
    getPaperId(paper) {
        const titleElement = paper.querySelector('.article-expander-title');
        if (!titleElement) return Math.random().toString(36);
        
        const title = titleElement.textContent;
        return btoa(title).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    isRead(paper) {
        const paperId = this.getPaperId(paper);
        return localStorage.getItem(`read-${paperId}`) === 'true';
    }

    isStarred(paper) {
        const paperId = this.getPaperId(paper);
        return localStorage.getItem(`starred-${paperId}`) === 'true';
    }

    toggleReadStatus(button) {
        const paperId = button.dataset.paperId;
        const paper = button.closest('.article-expander');
        const isRead = this.isRead(paper);
        
        localStorage.setItem(`read-${paperId}`, String(!isRead));
        button.classList.toggle('read', !isRead);
        button.textContent = !isRead ? '已读' : '未读';
    }

    toggleStarStatus(button) {
        const paperId = button.dataset.paperId;
        const paper = button.closest('.article-expander');
        const isStarred = this.isStarred(paper);
        
        localStorage.setItem(`starred-${paperId}`, String(!isStarred));
        button.classList.toggle('starred', !isStarred);
        button.textContent = !isStarred ? '⭐' : '☆';
    }

    restoreStatus(paper, paperId) {
        const readBtn = paper.querySelector('.read-btn');
        const starBtn = paper.querySelector('.star-btn');
        
        if (readBtn && this.isRead(paper)) {
            readBtn.classList.add('read');
            readBtn.textContent = '已读';
        }
        
        if (starBtn && this.isStarred(paper)) {
            starBtn.classList.add('starred');
            starBtn.textContent = '⭐';
        }
    }

    updateResultsCount() {
        const visiblePapers = document.querySelectorAll('article:not(:has(.paper-hidden))');
        const totalPapers = document.querySelectorAll('article').length;
        
        let countElement = document.getElementById('results-count');
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.id = 'results-count';
            countElement.style.cssText = 'text-align: center; margin: 8px 0; color: #666; font-size: 14px;';
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer) {
                searchContainer.appendChild(countElement);
            }
        }
        
        countElement.textContent = `显示 ${visiblePapers.length} / ${totalPapers} 篇论文`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 给页面一点时间完全加载
    setTimeout(() => {
        new SearchEnhancer();
    }, 500);
}); 