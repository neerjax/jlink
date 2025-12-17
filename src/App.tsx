import { useState } from 'react'
import './App.css'

interface JLink {
  url: string;
  ticket: string;
}

function App() {
  const [baseUrl, setBaseUrl] = useState('atlassian.net/browse/')
  const [isBaseUrlEditable, setIsBaseUrlEditable] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [tickets, setTickets] = useState('')
  const [jlinks, setJlinks] = useState<JLink[]>([])

  const generateLinks = () => {
    if (!baseUrl || !orgName || !projectName || !tickets) return

    // Split tickets by comma and clean them up
    const ticketList = tickets.split(',').map(t => t.trim()).filter(t => t)
    // Always uppercase the project name
    const upperProjectName = projectName.toUpperCase()
    
    const generatedLinks: JLink[] = ticketList.map(ticket => {
      // Remove project prefix if ticket already includes it (e.g., "PROJ-1234" -> "1234")
      const ticketNumber = ticket.includes('-') ? ticket.split('-').pop() || ticket : ticket
      const fullTicket = `${upperProjectName}-${ticketNumber}`
      const url = `https://${orgName}.${baseUrl}${fullTicket}`
      
      return {
        ticket: fullTicket,
        url
      }
    })

    setJlinks(generatedLinks)
  }

  const copyToClipboard = () => {
    const text = jlinks.map(link => link.url).join('\n')
    navigator.clipboard.writeText(text)
  }

  const downloadCSV = () => {
    const csv = jlinks.map(link => `${link.ticket},${link.url}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'jlinks.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadMarkdown = () => {
    const md = jlinks.map(link => `[${link.ticket}](${link.url})`).join('\n')
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'jlinks.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <header className="header">
        <h1><strong>NEERJAX / <span className="brand">JLINK</span></strong></h1>
      </header>

      <div className="hero">
        <h2 className="logo">
          <span className="logo-j">J</span>
          <span className="logo-link">Link</span>
        </h2>
        <p className="tagline">Turning PROJ-1234 into something you can click.</p>
      </div>

      <div className="content">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="baseUrl">JLink Base URL</label>
            <div className="input-with-icon">
              <input
                id="baseUrl"
                type="text"
                placeholder="atlassian.net/browse/"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                readOnly={!isBaseUrlEditable}
                className={!isBaseUrlEditable ? 'readonly-input' : ''}
              />
              <button
                type="button"
                className="edit-icon-btn"
                onClick={() => setIsBaseUrlEditable(!isBaseUrlEditable)}
                aria-label="Edit base URL"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.333 2.667a1.414 1.414 0 0 1 2 2L5.333 12.667l-3.333 1 1-3.333L11.333 2.667z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="orgName">JIRA Org Name</label>
            <input
              id="orgName"
              type="text"
              placeholder="e.g., n19studio"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectName">JIRA Project Name</label>
            <input
              id="projectName"
              type="text"
              placeholder="e.g., PROJ"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tickets">JIRA Ticket(s)</label>
            <textarea
              id="tickets"
              placeholder="comma separated ticket numbers (e.g., 1234, 5678)"
              value={tickets}
              onChange={(e) => setTickets(e.target.value)}
              rows={4}
            />
          </div>

          <button className="create-button" onClick={generateLinks}>
            Create Links
          </button>
        </div>

        <div className="results-section">
          <div className="results-header">
            {jlinks.length > 0 ? (
              <p>Your <strong className="count-number">{jlinks.length}</strong> {jlinks.length === 1 ? 'JLink is' : 'JLinks are'} ready.</p>
            ) : (
              <p className="empty-state">No JLinks to show.</p>
            )}
            {jlinks.length > 0 && (
              <div className="action-buttons">
                <button onClick={copyToClipboard} className="action-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="9" height="9" stroke="white" strokeWidth="1.5" fill="none"/>
                    <path d="M3 11V3C3 2.44772 3.44772 2 4 2H11" stroke="white" strokeWidth="1.5" fill="none"/>
                  </svg>
                  Copy
                </button>
                <button onClick={downloadCSV} className="action-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V11M8 11L5 8M8 11L11 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 13H14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Download CSV
                </button>
                <button onClick={downloadMarkdown} className="action-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V11M8 11L5 8M8 11L11 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 13H14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Download .md
                </button>
              </div>
            )}
          </div>

          <div className="links-list">
            {jlinks.length > 0 ? (
              jlinks.map((link, index) => (
                <div key={index} className="link-item">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
