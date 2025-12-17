import { useState } from 'react'
import './App.css'

interface JLink {
  url: string;
  ticket: string;
}

function App() {
  const [orgName, setOrgName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [tickets, setTickets] = useState('')
  const [jlinks, setJlinks] = useState<JLink[]>([])

  const generateLinks = () => {
    if (!orgName || !projectName || !tickets) return

    const ticketList = tickets.split(',').map(t => t.trim()).filter(t => t)
    const generatedLinks: JLink[] = ticketList.map(ticket => ({
      ticket,
      url: `https://${orgName}.atlassian.net/browse/${projectName}-${ticket}`
    }))

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
        <h1>N19 Studio / <span className="brand">JLink</span></h1>
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
            <label htmlFor="orgName">JIRA Org Name</label>
            <input
              id="orgName"
              type="text"
              placeholder="the part before .atlassian"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectName">JIRA Project Name</label>
            <input
              id="projectName"
              type="text"
              placeholder="the part before the numeric ticket number"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tickets">JIRA Ticket(s)</label>
            <textarea
              id="tickets"
              placeholder="comma separated tickets"
              value={tickets}
              onChange={(e) => setTickets(e.target.value)}
              rows={4}
            />
          </div>

          <button className="create-button" onClick={generateLinks}>
            Create Links
          </button>
        </div>

        {jlinks.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <p>Your <strong>{jlinks.length}</strong> JLinks are ready.</p>
              <div className="action-buttons">
                <button onClick={copyToClipboard} className="action-btn">
                  📋 Copy
                </button>
                <button onClick={downloadCSV} className="action-btn">
                  ⬇️ Download CSV
                </button>
                <button onClick={downloadMarkdown} className="action-btn">
                  ⬇️ Download .md
                </button>
              </div>
            </div>

            <div className="links-list">
              {jlinks.map((link, index) => (
                <div key={index} className="link-item">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
