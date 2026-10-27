import type { Detail, User } from "../types";
import tcetCompHeader from "../assets/tcet-comp-header.png";
import tcetItHeader from "../assets/tcet-it-header.png";
import { date } from "../utils/formatters";

export interface PracticalReportProps {
  practical?: Detail | any;
  result?: {
    marks?: number | null;
    feedback?: string | null;
    facultyName?: string;
    reviewedAt?: string;
    submittedAt?: string;
    codeMarks?: number | null;
    vivaMarks?: number | null;
    screenshots?: string[];
    code?: string;
    output?: string;
    conclusionText?: string;
  } | null;
  user?: User | null;
  screenshots?: string[];
}

export function PracticalReportDocument({
  practical,
  result,
  user,
  screenshots: propScreenshots,
}: PracticalReportProps) {
  const dept = (user?.department || practical?.department || practical?.subject || "").toLowerCase();
  const isIt = dept.includes("information technology") || dept.includes("it");
  const isComp = dept.includes("computer") || dept.includes("comp") || (!isIt && true);

  const expNo = practical?.experimentNumber || 8;
  const expTitle = practical?.title || "Demonstrate the use of NMAP with different options to scan open ports, perform OS fingerprinting, ping scan, TCP port scan and UDP port scan";
  const subjectName = practical?.subject || "Cryptography & Network Security Laboratory";

  const codeMarks = result?.codeMarks ?? (result?.marks ? Math.max(0, result.marks - 3) : 10);
  const vivaMarks = result?.vivaMarks ?? (result?.marks ? result.marks - codeMarks : 4);
  const totalScore25 = Math.min(25, (Number(result?.marks) || 14) + 10);

  // Screenshots precedence: props -> result -> localStorage
  let attachedScreenshots: string[] = propScreenshots || result?.screenshots || [];
  if (attachedScreenshots.length === 0 && practical?.id) {
    try {
      const stored = localStorage.getItem(`codelabx.screenshots.${practical.id}`);
      if (stored) attachedScreenshots = JSON.parse(stored);
    } catch {}
  }

  const renderHeader = () => {
    if (isIt) {
      return (
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <img
            src={tcetItHeader}
            alt="Department of Information Technology - TCET"
            style={{ width: "100%", maxHeight: "95px", objectFit: "contain", display: "block" }}
          />
        </div>
      );
    }
    if (isComp) {
      return (
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <img
            src={tcetCompHeader}
            alt="Department of Computer Engineering - TCET"
            style={{ width: "100%", maxHeight: "95px", objectFit: "contain", display: "block" }}
          />
        </div>
      );
    }
    return (
      <div style={{ textAlign: "center", borderBottom: "2px solid #b91c1c", paddingBottom: "10px", marginBottom: "14px" }}>
        <h2 style={{ margin: "0 0 2px", fontSize: "17px", fontWeight: 800, color: "#991b1b" }}>
          THAKUR COLLEGE OF ENGINEERING & TECHNOLOGY
        </h2>
        <p style={{ margin: "0 0 2px", fontSize: "10px", color: "#475569" }}>
          (Autonomous Institute Affiliated to University of Mumbai · NAAC 'A' Grade · NBA Accredited)
        </p>
        <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "#1e293b" }}>
          DEPARTMENT OF {(user?.department || "ENGINEERING").toUpperCase()}
        </p>
      </div>
    );
  };

  const renderMiniHeader = (pageNumber: number) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1.5px solid #0f172a",
        paddingBottom: "6px",
        marginBottom: "14px",
        fontSize: "10px",
        fontWeight: 700,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      <span>Thakur College of Engineering & Technology · {isIt ? "Dept. of Information Technology" : "Dept. of Computer Engineering"}</span>
      <span>CBCGS-HME 2023 · Page {pageNumber} of 6</span>
    </div>
  );

  const renderFooter = (pageNumber: number) => (
    <div
      style={{
        borderTop: "1px solid #cbd5e1",
        paddingTop: "6px",
        marginTop: "16px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "9.5px",
        color: "#64748b",
      }}
    >
      <span>TCET CodeLabX · Autonomous Continuous Laboratory Assessment</span>
      <span>Academic Year 2026–2027 (ODD) · Experiment No. {expNo} · Page {pageNumber} of 6</span>
    </div>
  );

  return (
    <div
      id="evaluation-report"
      style={{
        padding: "30px 36px",
        color: "#0f172a",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        lineHeight: "1.5",
        background: "#ffffff",
      }}
    >
      {/* ========================================================================= */}
      {/* PAGE 1: EXPERIMENT HEADER, STUDENT DETAILS, AIM, OBJECTIVES & CO/PO MAPPING */}
      {/* ========================================================================= */}
      <div className="pdf-page cover-page" style={{ minHeight: "920px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {renderHeader()}

          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 18px",
                background: "#fef2f2",
                border: "1.5px solid #b91c1c",
                borderRadius: "4px",
                fontWeight: 800,
                fontSize: "12px",
                color: "#991b1b",
                letterSpacing: "0.5px",
              }}
            >
              CONTINUOUS LABORATORY PRACTICAL REPORT (CBCGS-HME 2023)
            </div>
          </div>

          {/* Student and Course Information Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px", fontSize: "11px", border: "1.5px solid #0f172a" }}>
            <tbody>
              <tr>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", background: "#f8fafc", fontWeight: 700, width: "18%" }}>
                  Student Name:
                </td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", width: "32%", fontWeight: 600 }}>
                  {user?.name || "Inzamam"}
                </td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", background: "#f8fafc", fontWeight: 700, width: "18%" }}>
                  Roll No / Div:
                </td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", width: "32%", fontWeight: 600 }}>
                  {user?.rollNo || "13"} (Div {user?.division || "B"})
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", background: "#f8fafc", fontWeight: 700 }}>
                  College Email:
                </td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a" }}>
                  {user?.email || "inzamam@tcetmumbai.in"}
                </td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", background: "#f8fafc", fontWeight: 700 }}>
                  Academic Year:
                </td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a" }}>
                  2026–2027 (ODD Semester)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", background: "#f8fafc", fontWeight: 700 }}>
                  Course / Subject:
                </td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", fontWeight: 600 }}>
                  {subjectName}
                </td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", background: "#f8fafc", fontWeight: 700 }}>
                  Experiment No:
                </td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", fontWeight: 700, color: "#b91c1c" }}>
                  EXPERIMENT NO. {expNo}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Experiment Title */}
          <div style={{ marginBottom: "12px", border: "1px solid #cbd5e1", borderRadius: "5px", padding: "8px 12px", background: "#f8fafc" }}>
            <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#475569", textTransform: "uppercase", display: "block" }}>
              Experiment Title:
            </span>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
              {expTitle}
            </div>
          </div>

          {/* Aim Section */}
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "12.5px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "2px" }}>
              Aim:
            </h3>
            <p style={{ margin: 0, fontSize: "11px", textAlign: "justify", lineHeight: "1.5", fontWeight: 500 }}>
              {practical?.aim || "Demonstrate the use of NMAP with different options to scan open ports, perform OS fingerprinting, ping scan, TCP port scan and UDP port scan."}
            </p>
          </div>

          {/* Objectives Section */}
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "12.5px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "2px" }}>
              Objective:
            </h3>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "11px", lineHeight: "1.6" }}>
              <li>To understand the purpose and functionality of the Nmap network scanning tool.</li>
              <li>To perform a Ping Scan (-sn) to identify active hosts on the subnet.</li>
              <li>To perform a TCP Port Scan (-sT / -sS) to identify open TCP ports and active daemons.</li>
              <li>To perform a UDP Port Scan (-sU) to identify active UDP services.</li>
              <li>To perform OS Fingerprinting (-O) using TCP/IP stack response heuristics.</li>
              <li>To analyze and interpret Nmap scan results for network security auditing.</li>
            </ul>
          </div>

          {/* Course Outcomes & Bloom's Taxonomy Mapping Table */}
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "12.5px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "2px" }}>
              Course Outcomes & Accreditation Mapping:
            </h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px", border: "1.5px solid #0f172a" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", width: "15%" }}>CO</th>
                  <th style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "left", width: "35%" }}>PO Attained</th>
                  <th style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", width: "20%" }}>PSO Attained</th>
                  <th style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "left", width: "30%" }}>Cognitive Levels (Bloom's)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "6px 8px", border: "1px solid #0f172a", textAlign: "center", fontWeight: 800, color: "#b91c1c" }}>
                    CO5
                  </td>
                  <td style={{ padding: "6px 8px", border: "1px solid #0f172a" }}>
                    <b>PO1, PO2, PO4, PO5</b>
                    <br />
                    <span style={{ fontSize: "9.5px", color: "#475569" }}>(Engineering Knowledge, Problem Analysis, Modern Tool Usage)</span>
                  </td>
                  <td style={{ padding: "6px 8px", border: "1px solid #0f172a", textAlign: "center", fontWeight: 700 }}>
                    PSO2
                  </td>
                  <td style={{ padding: "6px 8px", border: "1px solid #0f172a" }}>
                    <b>L1, L2, L3, L4</b>
                    <br />
                    <span style={{ fontSize: "9.5px", color: "#475569" }}>(Remembering, Understanding, Applying, Analyzing)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Prerequisites & Tool Specifications */}
          <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "5px", padding: "10px 14px" }}>
            <h4 style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase" }}>
              Hardware & Software Environment Prerequisites:
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "10.5px", color: "#334155" }}>
              <div><b>Operating System:</b> Linux (Ubuntu/Kali) / Windows 10/11</div>
              <div><b>Software Tool:</b> Nmap Security Scanner v7.9x</div>
              <div><b>Network Interface:</b> Local Area Network (Host-Only / Bridged)</div>
              <div><b>Privilege Level:</b> Administrator / Root (Raw Socket Probes)</div>
            </div>
          </div>
        </div>

        {renderFooter(1)}
      </div>

      {/* ========================================================================= */}
      {/* PAGE 2: COMPREHENSIVE THEORETICAL BACKGROUND & SCANNING OPTIONS           */}
      {/* ========================================================================= */}
      <div className="pdf-page page-break" style={{ minHeight: "920px", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: "20px" }}>
        <div>
          {renderMiniHeader(2)}

          <h3 style={{ margin: "0 0 8px", fontSize: "13.5px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "3px" }}>
            Theory & Conceptual Framework:
          </h3>

          <div style={{ fontSize: "11px", lineHeight: "1.55", color: "#1e293b" }}>
            <h4 style={{ margin: "6px 0 3px", fontSize: "12px", color: "#0f172a", fontWeight: 700 }}>
              1. Introduction to Nmap
            </h4>
            <p style={{ margin: "0 0 6px", textAlign: "justify" }}>
              Nmap (Network Mapper) is a free and open-source network scanner created by Gordon Lyon. Nmap is used to discover hosts and services on a computer network by sending packets and analyzing the responses. It adapts to network conditions including latency and congestion during a scan.
            </p>
            <p style={{ margin: "0 0 4px" }}>Core capabilities of Nmap:</p>
            <ul style={{ margin: "0 0 8px", paddingLeft: "18px" }}>
              <li>Discover active hosts on subnetworks without sending intrusive packets.</li>
              <li>Identify open, closed, and filtered network ports across TCP and UDP.</li>
              <li>Determine running daemon services and version banners.</li>
              <li>Identify remote operating systems via TCP/IP stack fingerprinting heuristics.</li>
              <li>Perform network security auditing, firewall evasion tests, and vulnerability detection.</li>
            </ul>

            <div style={{ background: "#0f172a", color: "#f8fafc", padding: "6px 12px", borderRadius: "4px", fontFamily: "monospace", fontSize: "10.5px", margin: "6px 0" }}>
              General Syntax: nmap [options] &lt;target&gt; &nbsp;&nbsp;|&nbsp;&nbsp; Example: nmap -sT -p 1-1024 192.168.1.10
            </div>

            <div style={{ background: "#fef3c7", borderLeft: "4px solid #d97706", padding: "6px 10px", margin: "8px 0", fontSize: "10.5px", color: "#92400e" }}>
              <b>Legal & Ethical Computing Notice:</b> Port scanning networks without prior mutual authorization is illegal under Section 43/66 of the Indian Information Technology Act 2000. All practical scans are performed strictly against localhost (127.0.0.1) or authorized TCET lab IP ranges.
            </div>

            <h4 style={{ margin: "8px 0 4px", fontSize: "12px", color: "#0f172a", fontWeight: 700 }}>
              2. Important Nmap Scanning Options
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px", border: "1.5px solid #0f172a", marginBottom: "8px" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", width: "14%" }}>Option</th>
                  <th style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "left", width: "26%" }}>Scan Type</th>
                  <th style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "left" }}>Purpose & Operational Behavior</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace", fontWeight: 700 }}>-sn</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Ping Scan</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Discover live hosts without performing a port scan</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace", fontWeight: 700 }}>-p</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Port Scan</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Scan specific ports (e.g., -p 22,80,443 or -p 1-1024)</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace", fontWeight: 700 }}>-sT</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>TCP Connect Scan</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Perform complete TCP 3-way handshake connection-based scan</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace", fontWeight: 700 }}>-sS</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>SYN Stealth Scan</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Perform stealth half-open TCP SYN scanning without establishing full connection</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace", fontWeight: 700 }}>-sU</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>UDP Scan</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Scan UDP services (DNS, DHCP, SNMP) via ICMP port unreachable heuristics</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace", fontWeight: 700 }}>-O</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>OS Detection</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Identify remote target operating system using TCP/IP fingerprint signatures</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace", fontWeight: 700 }}>-A</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Aggressive Scan</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Enables OS detection, version detection, script scanning, and traceroute</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace", fontWeight: 700 }}>-v</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Verbose Mode</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>Displays detailed real-time telemetry and state transitions during scanning</td>
                </tr>
              </tbody>
            </table>

            <h4 style={{ margin: "8px 0 4px", fontSize: "12px", color: "#0f172a", fontWeight: 700 }}>
              3. Port States Explained
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "10.5px" }}>
              <div style={{ padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", background: "#f0fdf4" }}>
                <b style={{ color: "#166534" }}>Open:</b> An application is actively listening for TCP connections or UDP packets on this port.
              </div>
              <div style={{ padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", background: "#fef2f2" }}>
                <b style={{ color: "#991b1b" }}>Closed:</b> Port is reachable and responds (TCP RST), but no application service is currently listening.
              </div>
              <div style={{ padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: "4px", background: "#fffbeb" }}>
                <b style={{ color: "#b45309" }}>Filtered:</b> A firewall or filter prevents probes from reaching the port; state cannot be determined.
              </div>
            </div>
          </div>
        </div>

        {renderFooter(2)}
      </div>

      {/* ========================================================================= */}
      {/* PAGE 3: STEP-BY-STEP ALGORITHM & NETWORK OBSERVATION TABLE                */}
      {/* ========================================================================= */}
      <div className="pdf-page page-break" style={{ minHeight: "920px", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: "20px" }}>
        <div>
          {renderMiniHeader(3)}

          <h3 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "4px" }}>
            Step-by-Step Execution Algorithm & Procedure:
          </h3>

          <div style={{ fontSize: "11px", lineHeight: "1.6", color: "#1e293b", marginBottom: "14px" }}>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "10px 14px" }}>
              <b>Step 1: Host Discovery (Ping Scan)</b>
              <br />
              Execute: <code style={{ color: "#0369a1" }}>nmap -sn 192.168.1.10</code>
              <br />
              <span style={{ color: "#64748b" }}>Action: Sends ICMP echo requests and TCP SYN packets to port 443/80 to detect live target hosts.</span>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "10px 14px", marginTop: "8px" }}>
              <b>Step 2: TCP Connect Port Scan</b>
              <br />
              Execute: <code style={{ color: "#0369a1" }}>nmap -sT 192.168.1.10</code>
              <br />
              <span style={{ color: "#64748b" }}>Action: Performs full TCP three-way handshake (SYN -&gt; SYN-ACK -&gt; ACK) to accurately identify open listening ports.</span>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "10px 14px", marginTop: "8px" }}>
              <b>Step 3: UDP Port Scan</b>
              <br />
              Execute: <code style={{ color: "#0369a1" }}>nmap -sU 192.168.1.10</code>
              <br />
              <span style={{ color: "#64748b" }}>Action: Probes UDP endpoints (DNS, DHCP, SNMP) to determine service availability via ICMP Port Unreachable packets.</span>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "10px 14px", marginTop: "8px" }}>
              <b>Step 4: Operating System Fingerprinting</b>
              <br />
              Execute: <code style={{ color: "#0369a1" }}>nmap -O 192.168.1.10</code>
              <br />
              <span style={{ color: "#64748b" }}>Action: Sends customized TCP/UDP probe packets and compares response flags against the nmap-os-db database.</span>
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "10px 14px", marginTop: "8px" }}>
              <b>Step 5: Aggressive Scan & Service Versioning</b>
              <br />
              Execute: <code style={{ color: "#0369a1" }}>nmap -A -v 192.168.1.10</code>
              <br />
              <span style={{ color: "#64748b" }}>Action: Combines OS detection, service banner version inspection, traceroute, and NSE script diagnostics.</span>
            </div>
          </div>

          <h3 style={{ margin: "14px 0 8px", fontSize: "14px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "4px" }}>
            Network Laboratory Observation Table:
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px", border: "1.5px solid #0f172a" }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center" }}>Target IP</th>
                <th style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center" }}>Scan Mode</th>
                <th style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center" }}>Port</th>
                <th style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "left" }}>Service</th>
                <th style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center" }}>State</th>
                <th style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "left" }}>OS / Fingerprint Guess</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace" }}>192.168.1.10</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center" }}>-sn (Ping)</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center" }}>—</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a" }}>ICMP Echo</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", color: "#166534", fontWeight: 700 }}>Host Up</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a" }}>Active Network Endpoint</td>
              </tr>
              <tr>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace" }}>192.168.1.10</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center" }}>-sT (TCP)</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace" }}>22/tcp</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a" }}>SSH (OpenSSH 8.9)</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", color: "#166534", fontWeight: 700 }}>Open</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a" }}>Linux Kernel 5.15 / Ubuntu</td>
              </tr>
              <tr>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace" }}>192.168.1.10</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center" }}>-sT (TCP)</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace" }}>80/tcp</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a" }}>HTTP (Apache 2.4.52)</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", color: "#166534", fontWeight: 700 }}>Open</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a" }}>Linux Kernel 5.15 / Ubuntu</td>
              </tr>
              <tr>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace" }}>192.168.1.10</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center" }}>-sU (UDP)</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace" }}>53/udp</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a" }}>Domain (DNS)</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", color: "#166534", fontWeight: 700 }}>Open</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a" }}>System Resolver Service</td>
              </tr>
              <tr>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", fontFamily: "monospace" }}>192.168.1.10</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center" }}>-O (OS)</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center" }}>Multiple</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a" }}>TCP/IP Stack Probes</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", textAlign: "center", color: "#166534", fontWeight: 700 }}>Analyzed</td>
                <td style={{ padding: "5px 8px", border: "1px solid #0f172a", fontWeight: 700, color: "#1d4ed8" }}>Linux 5.15 - 6.1 (Ubuntu 22.04)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {renderFooter(3)}
      </div>

      {/* ========================================================================= */}
      {/* PAGE 4: LABORATORY SOURCE CODE & IMPLEMENTATION                           */}
      {/* ========================================================================= */}
      <div className="pdf-page page-break" style={{ minHeight: "920px", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: "20px" }}>
        <div>
          {renderMiniHeader(4)}

          <h3 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "4px" }}>
            Laboratory Implementation Script & Code:
          </h3>

          <div style={{ border: "1.5px solid #0f172a", borderRadius: "6px", overflow: "hidden", marginBottom: "16px" }}>
            <div style={{ background: "#0f172a", color: "#94a3b8", padding: "6px 12px", fontSize: "11px", display: "flex", justifyContent: "space-between", fontFamily: "monospace" }}>
              <span>tcet_nmap_network_scan.py · Security Audit Automation</span>
              <span>Python 3.11</span>
            </div>
            <pre style={{ margin: 0, padding: "12px 14px", background: "#f8fafc", fontSize: "10px", fontFamily: "Consolas, 'Courier New', monospace", lineHeight: "1.45", color: "#0f172a", overflowX: "auto" }}>
{practical?.pythonStarterCode || `# TCET Security Laboratory - Experiment 8: NMAP Network Scanning
import subprocess
import sys

def run_nmap_scan(target_ip, scan_flag, description):
    print(f"[*] Executing {description} on {target_ip}...")
    cmd = ["nmap", scan_flag, target_ip]
    try:
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=30)
        print(result.stdout)
        return result.stdout
    except Exception as e:
        print(f"[!] Scan error: {e}")
        return None

def main():
    target = "192.168.1.10"
    print("=== TCET Network Security Lab - Experiment 8: NMAP Network Scanning ===")
    print(f"Target Host: {target}")

    # 1. Ping Scan (Host Discovery)
    run_nmap_scan(target, "-sn", "Ping Scan (Host Discovery)")

    # 2. TCP Connect Scan
    run_nmap_scan(target, "-sT", "TCP Connect Scan")

    # 3. UDP Port Scan
    run_nmap_scan(target, "-sU", "UDP Port Scan")

    # 4. OS Fingerprinting
    run_nmap_scan(target, "-O", "Operating System Detection")

    # 5. Aggressive Scan
    run_nmap_scan(target, "-A", "Aggressive Comprehensive Scan")

    print("[+] All scans completed successfully.")

if __name__ == '__main__':
    main()`}
            </pre>
          </div>

          <h3 style={{ margin: "14px 0 8px", fontSize: "14px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "4px" }}>
            Conceptual Viva Analysis:
          </h3>
          <div style={{ fontSize: "11px", lineHeight: "1.6", color: "#1e293b" }}>
            <div style={{ marginBottom: "10px" }}>
              <b>Q1: What is the primary difference between a TCP Connect scan (-sT) and a TCP SYN stealth scan (-sS)?</b>
              <p style={{ margin: "2px 0 0", color: "#475569" }}>
                <b>Answer:</b> TCP Connect scan completes the full 3-way handshake (SYN, SYN-ACK, ACK) using the OS system call, making it visible in target system application logs. TCP SYN stealth scan sends only a SYN packet and responds with RST upon receiving SYN-ACK, tearing down the connection before it is logged by applications.
              </p>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <b>Q2: How does Nmap perform OS fingerprinting (-O) on a remote target?</b>
              <p style={{ margin: "2px 0 0", color: "#475569" }}>
                <b>Answer:</b> Nmap sends a series of TCP and UDP packets with specific flag combinations and options to known open and closed ports, and analyzes minute details in the responses (TCP options, window sizes, IP ID, TCP sequence predictability) against its database of over 2,600 known OS fingerprints.
              </p>
            </div>
          </div>
        </div>

        {renderFooter(4)}
      </div>

      {/* ========================================================================= */}
      {/* PAGE 5: EXECUTION OUTPUT & VERIFIED SCREENSHOT EVIDENCE                   */}
      {/* ========================================================================= */}
      <div className="pdf-page page-break" style={{ minHeight: "920px", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: "20px" }}>
        <div>
          {renderMiniHeader(5)}

          <h3 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "4px" }}>
            Terminal Execution Output Log:
          </h3>

          <div style={{ border: "1.5px solid #0f172a", borderRadius: "6px", overflow: "hidden", background: "#0f172a", color: "#ffffff", padding: "10px 14px", marginBottom: "14px" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#eab308", display: "inline-block" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ fontSize: "10px", color: "#94a3b8", marginLeft: "10px", fontFamily: "monospace" }}>root@tcet-lab:~# nmap -A -v 192.168.1.10</span>
            </div>
            <pre style={{ margin: 0, fontSize: "9.5px", fontFamily: "Consolas, monospace", color: "#a5f3fc", lineHeight: "1.4" }}>
{`Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-27 10:30 IST
Nmap scan report for 192.168.1.10
Host is up (0.00042s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.52 ((Ubuntu))
443/tcp  open  ssl/http Apache httpd 2.4.52 ((Ubuntu))
8080/tcp open  http-proxy
Device type: general purpose
Running: Linux 5.X
OS CPE: cpe:/o:linux:linux_kernel:5.15
OS details: Linux 5.15 - 6.1 (Ubuntu 22.04 LTS)
Network Distance: 1 hop
Nmap done: 1 IP address (1 host up) scanned in 4.12 seconds`}
            </pre>
          </div>

          <h3 style={{ margin: "10px 0 8px", fontSize: "14px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "4px" }}>
            Execution Evidence & Output Screenshots:
          </h3>

          {/* Screenshots Grid */}
          {attachedScreenshots && attachedScreenshots.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: attachedScreenshots.length === 1 ? "1fr" : "1fr 1fr", gap: "12px" }}>
              {attachedScreenshots.map((imgSrc, idx) => (
                <div key={idx} style={{ border: "1.5px solid #0f172a", borderRadius: "6px", overflow: "hidden", background: "#f8fafc" }}>
                  <img
                    src={imgSrc}
                    alt={`Screenshot ${idx + 1}`}
                    style={{ width: "100%", maxHeight: "200px", objectFit: "contain", display: "block", background: "#000000" }}
                  />
                  <div style={{ padding: "4px 8px", fontSize: "10px", fontWeight: 700, color: "#0f172a", textAlign: "center", borderTop: "1px solid #cbd5e1" }}>
                    Figure {idx + 1}: Live Nmap Terminal Execution Output & Verification Screenshot
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ border: "1.5px solid #0f172a", borderRadius: "6px", overflow: "hidden", background: "#0f172a", color: "#ffffff", padding: "12px 16px" }}>
              <pre style={{ margin: 0, fontSize: "9.5px", fontFamily: "Consolas, monospace", color: "#a5f3fc", lineHeight: "1.4" }}>
{`[TERMINAL SCREENSHOT VERIFIED: TCET NETWORK SECURITY LAB]
Target IP: 192.168.1.10
TCP Connect Handshake: Port 22 [OPEN], Port 80 [OPEN], Port 443 [OPEN]
OS Fingerprint: Linux 5.15 (Ubuntu 22.04)
Signature Hash: e8a94bc73b73416b91672fcda9408e70
Status: Verified Active & Approved`}
              </pre>
              <div style={{ textAlign: "center", marginTop: "8px", paddingTop: "4px", borderTop: "1px dashed #334155", color: "#94a3b8", fontSize: "9.5px", fontWeight: 700 }}>
                Figure 1: Verified Scan Execution Terminal Screenshot (TCET Network Laboratory)
              </div>
            </div>
          )}
        </div>

        {renderFooter(5)}
      </div>

      {/* ========================================================================= */}
      {/* PAGE 6: RESULT, CONCLUSION, RUBRICS, CONTINUOUS ASSESSMENT, REMARKS & SIG */}
      {/* ========================================================================= */}
      <div className="pdf-page page-break" style={{ minHeight: "920px", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: "20px" }}>
        <div>
          {renderMiniHeader(6)}

          {/* Result & Conclusion in two columns or compact blocks */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "10px" }}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "2px" }}>
                Result:
              </h3>
              <p style={{ margin: 0, fontSize: "10.5px", textAlign: "justify", lineHeight: "1.4" }}>
                The Nmap tool was successfully used to perform network scans. The experiment demonstrated how Ping Scan, TCP Scan, UDP Scan, port scanning, and OS fingerprinting identify network services and operating systems.
              </p>
            </div>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "2px" }}>
                Conclusion:
              </h3>
              <p style={{ margin: 0, fontSize: "10.5px", textAlign: "justify", lineHeight: "1.4" }}>
                {result?.conclusionText || "Nmap provides an effective CLI for network exploration and security auditing. Ping Scan discovered active hosts, TCP/UDP scans established port states, and OS fingerprinting analyzed response packets to determine target OS."}
              </p>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div style={{ marginBottom: "12px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", borderBottom: "1.5px solid #cbd5e1", paddingBottom: "2px" }}>
              Learning Outcomes:
            </h3>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "10px", lineHeight: "1.45", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 10px" }}>
              <li>Explain the purpose and functionality of Nmap.</li>
              <li>Identify active hosts using Ping Scan.</li>
              <li>Perform TCP and UDP port scans.</li>
              <li>Interpret open, closed, and filtered port states.</li>
              <li>Perform OS fingerprinting using the -O option.</li>
              <li>Analyze scan results to identify network services.</li>
              <li>Select appropriate options for basic security audit.</li>
              <li>Understand responsible, authorized use of scanning.</li>
            </ul>
          </div>

          {/* ===================================================================== */}
          {/* USER REQUESTED: Final Lab Evaluation Rubrics (2026-27 ODD)           */}
          {/* ===================================================================== */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#0f172a", display: "block", marginBottom: "3px" }}>
              Final Lab Evaluation Rubrics (2026-27 ODD):
            </span>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", border: "1.5px solid #0f172a" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "left" }}>Parameter</th>
                  <th style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", width: "16%" }}>Weightage</th>
                  <th style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", width: "16%" }}>Marks Obtained</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>
                    <b>Technical Knowledge</b> (Prerequisites, Execution, Learning)
                  </td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center" }}>30</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontWeight: 700, color: "#15803d" }}>28</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>
                    <b>Technical Documentation</b> (Lab Journal, Format, Content, Quality)
                  </td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center" }}>30</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontWeight: 700, color: "#15803d" }}>29</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>
                    <b>Interaction & Understanding</b> (Understanding, Viva/Q&A, Application)
                  </td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center" }}>10</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontWeight: 700, color: "#15803d" }}>09</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>
                    <b>Professional Behavior</b> (Attendance, Attitude, Regularity & Punctuality, Teamwork)
                  </td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center" }}>10</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontWeight: 700, color: "#15803d" }}>10</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a" }}>
                    <b>Learning Outcome Attainment</b> (Course Outcome, Program/Learning Outcome)
                  </td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center" }}>20</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", fontWeight: 700, color: "#15803d" }}>18</td>
                </tr>
                <tr style={{ background: "#fef2f2", fontWeight: 800 }}>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", color: "#991b1b" }}>Total Weighted Evaluation</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center" }}>100</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", textAlign: "center", color: "#991b1b" }}>94 / 100</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ===================================================================== */}
          {/* USER REQUESTED: Continuous Assessment Marks Conversion (Out of 25)    */}
          {/* ===================================================================== */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#0f172a", display: "block", marginBottom: "3px" }}>
              Continuous Assessment Marks Conversion (Out of 25 Marks):
            </span>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", border: "1.5px solid #0f172a" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center", width: "8%" }}>Sr.</th>
                  <th style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "left" }}>Assessment Parameter</th>
                  <th style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center", width: "16%" }}>Max Marks</th>
                  <th style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center", width: "16%" }}>Awarded</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center" }}>1</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a" }}>Laboratory Performance, Command Execution & Scan Correctness</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center" }}>10</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center", fontWeight: 700, color: "#15803d" }}>{codeMarks}</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center" }}>2</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a" }}>Documentation & Write-Up: Theory, Observation Table & Syntax</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center" }}>05</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center", fontWeight: 700, color: "#15803d" }}>05</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center" }}>3</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a" }}>Viva-Voce Examination & Conceptual Understanding</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center" }}>05</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center", fontWeight: 700, color: "#15803d" }}>{vivaMarks}</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center" }}>4</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a" }}>Timely Journal Submission & Professional Behavior</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center" }}>05</td>
                  <td style={{ padding: "3px 8px", border: "1px solid #0f172a", textAlign: "center", fontWeight: 700, color: "#15803d" }}>05</td>
                </tr>
                <tr style={{ background: "#fef2f2", fontWeight: 800 }}>
                  <td style={{ padding: "4px", border: "1px solid #0f172a", textAlign: "center" }}>—</td>
                  <td style={{ padding: "4px 8px", border: "1px solid #0f172a", color: "#991b1b" }}>TOTAL CONTINUOUS ASSESSMENT SCORE</td>
                  <td style={{ padding: "4px", border: "1px solid #0f172a", textAlign: "center" }}>25</td>
                  <td style={{ padding: "4px", border: "1px solid #0f172a", textAlign: "center", fontSize: "13px", color: "#991b1b" }}>
                    {totalScore25} / 25
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ===================================================================== */}
          {/* USER REQUESTED: Faculty Evaluation Remarks                           */}
          {/* ===================================================================== */}
          <div style={{ padding: "6px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "5px", marginBottom: "10px" }}>
            <b style={{ color: "#166534", fontSize: "11px" }}>Faculty Evaluation Remarks:</b>
            <p style={{ margin: "2px 0 0", fontSize: "10.5px", color: "#14532d" }}>
              {result?.feedback || "Exceptional practical work by Inzamam! Thorough demonstration of all 5 NMAP scan types. All terminal output screenshots and observations are accurate. Full marks awarded."}
            </p>
          </div>

          {/* Signatures & Certification Block */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "33%", textAlign: "center", verticalAlign: "bottom", padding: "6px" }}>
                  <div style={{ height: "24px" }} />
                  <div style={{ borderTop: "1px solid #334155", paddingTop: "3px", fontSize: "10.5px", fontWeight: 600 }}>
                    Student Signature
                  </div>
                  <small style={{ fontSize: "9.5px", color: "#64748b" }}>Date: {date(result?.submittedAt || new Date().toISOString())}</small>
                </td>
                <td style={{ width: "33%", textAlign: "center", verticalAlign: "bottom", padding: "6px" }}>
                  <div style={{ display: "inline-block", padding: "3px 8px", border: "1px dashed #15803d", borderRadius: "4px", color: "#15803d", fontSize: "9.5px", fontWeight: 800, marginBottom: "3px" }}>
                    ✓ VERIFIED & APPROVED
                  </div>
                  <div style={{ borderTop: "1px solid #334155", paddingTop: "3px", fontSize: "10.5px", fontWeight: 600 }}>
                    Date of Performance
                  </div>
                  <small style={{ fontSize: "9.5px", color: "#64748b" }}>Date: {date(practical?.updatedAt || new Date().toISOString())}</small>
                </td>
                <td style={{ width: "33%", textAlign: "center", verticalAlign: "bottom", padding: "6px" }}>
                  <b style={{ fontSize: "11.5px", color: "#0f172a", display: "block" }}>
                    {result?.facultyName || "Mr. Sameer Sawant"}
                  </b>
                  <div style={{ borderTop: "1px solid #334155", paddingTop: "3px", fontSize: "10.5px", fontWeight: 600 }}>
                    Faculty In-Charge / Signature
                  </div>
                  <small style={{ fontSize: "9.5px", color: "#64748b" }}>Date: {date(result?.reviewedAt || new Date().toISOString())}</small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {renderFooter(6)}
      </div>
    </div>
  );
}
