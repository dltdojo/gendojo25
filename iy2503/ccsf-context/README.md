脈絡工程（Context Engineering）不僅僅是一個功能開發概念，從資安的角度看，**每一個「脈絡」元素——工具、數據、權限、角色——都是一個潛在的攻擊面（Attack Surface）**。

為了系統性地管理這些新興風險，我參照了業界黃金標準 **NIST Cybersecurity Framework 2.0** 的六大功能（治理、識別、保護、偵測、應對、復原），為本公司量身打造了全球首個針對生成式 AI 的資安框架：

**「企業生成式 AI 脈絡工程網路安全框架」（Cyber Context Security Framework for Generative AI, CCSF）**。

這份框架旨在為我們的 AI 開發團隊、維運團隊及風險管理部門提供一套共同的語言和標準，以確保我們在擁抱 AI 創新的同時，能夠有效管理其伴隨而來的資安風險。

---

### **企業生成式 AI 脈絡工程網路安全框架 (CCSF) v1.0**

**文件編號:** CISO-AI-FRM-001
**發布日期:** 2025年7月7日
**制定者:** 資安長辦公室

#### **1. 框架宗旨在於**

本框架旨在提供一套自願性、基於風險管理的指導方針，用於管理與企業內部生成式 AI 應用相關的「脈絡工程」網路安全風險。本框架並非旨在取代現有資安政策，而是作為其針對 AI 領域的擴展和補充，確保 AI 應用的開發、部署與維運生命週期中，其「脈絡」的完整性、機密性與可用性。

#### **2. 核心概念：將「脈絡」視為需保護的核心資產**

在 CCSF 框架中，我們將 AI 的「脈絡」定義為一個複合性資產，包含以下五個可識別和保護的層面：

1.  **數據脈絡 (Data Context):** 餵養給 AI 的所有資訊，包括 RAG 檢索的企業文件、資料庫查詢結果、使用者的即時輸入等。
2.  **工具脈絡 (Tool Context):** AI 被授權呼叫的所有外部或內部功能，如 API、函式庫、外掛程式、Shell 指令等。
3.  **角色脈絡 (Persona Context):** AI 的系統提示（System Prompt）中定義的身份、行為準則、安全護欄（Guardrails）及應遵循的規範。
4.  **會話脈絡 (Session Context):** 使用者的身份、歷史對話記錄、及在一次互動中持續存在的狀態。
5.  **環境脈絡 (Environment Context):** AI 應用本身運行的基礎設施，如 IDE、CLI、雲端容器、伺服器等。

#### **3. CCSF 框架核心**

本框架參照 NIST CSF 2.0 的六大核心功能，並針對 AI 脈絡工程的特性，定義了具體的「類別」與「子類別」作為控制目標。

| 功能 (Function) | 類別 (Category) | 子類別 (Subcategory) - 控制目標範例 | 參考資訊 (Informative References) |
| :--- | :--- | :--- | :--- |
| **治理 (GOVERN)** | **GV.CP: 脈絡策略與政策 (Context Policy)** | GV.CP-01: 建立並維護一份「AI 脈絡可接受使用政策」，明確定義可被接入的數據源、工具及服務等級。 | NIST AI RMF, ISO/IEC 42001 |
| | **GV.RM: 脈絡風險管理 (Context Risk Management)** | GV.RM-01: 將 AI 脈絡相關威脅（如工具濫用、數據洩漏）納入企業整體風險評估模型中。 | NIST AI RMF |
| **識別 (IDENTIFY)** | **ID.AM: 脈絡資產管理 (Context Asset Management)** | ID.AM-01: 維護一份所有 AI 應用的「脈絡清單」，詳細記錄每個應用被授權的數據源、工具 API 及核心角色提示。 | CMDB, ISO/IEC 42001 |
| | **ID.RA: 風險評估 (Risk Assessment)** | ID.RA-01: 針對每個工具脈絡進行威脅建模，識別潛在的權限擴張或間接提示注入（Indirect Prompt Injection）風險。 | OWASP Top 10 for LLMs, MITRE ATLAS |
| **保護 (PROTECT)** | **PR.AC: 脈絡存取控制 (Context Access Control)** | PR.AC-01: 對 AI 的工具呼叫實施「最小權限原則」，確保 AI 僅能執行完成任務所必需的操作。 | Zero Trust Architecture |
| | **PR.DS: 數據脈絡安全 (Data Context Security)** | PR.DS-01: 在數據進入 AI 脈絡前，透過自動化工具對敏感資訊（PII, CPNI）進行遮罩或匿名化處理。 | DLP, Data Masking Tech |
| | **PR.PT: 角色脈絡完整性 (Persona Context Integrity)** | PR.PT-01: 部署多層次防禦機制（如輸入過濾、輸出驗證），以抵抗提示注入（Prompt Injection）和越獄（Jailbreaking）攻擊。 | OWASP Top 10 for LLMs |
| | **PR.TC: 工具脈絡安全 (Tool Context Security)** | PR.TC-01: 要求所有被 AI 呼叫的內部工具 API 必須經過嚴格的輸入驗證與認證授權。 | Secure SDLC, API Security |
| **偵測 (DETECT)** | **DE.CM: 脈絡持續監控 (Context Continuous Monitoring)** | DE.CM-01: 詳細記錄所有 AI 的脈絡互動日誌，包括收到的提示、調用的工具、訪問的數據及最終的輸出。 | SIEM, Observability |
| | **DE.AE: 異常與事件偵測 (Anomalies & Events)** | DE.AE-01: 建立 AI 正常行為基線（如：工具呼叫頻率、數據查詢模式），並對偏離基線的行為進行即時告警。 | UEBA, Anomaly Detection |
| **應對 (RESPOND)** | **RS.RP: 應變計畫 (Response Planning)** | RS.RP-01: 制定針對「AI 脈絡失控」的應變計畫，包括即時停用惡意工具或切斷敏感數據源的程序。 | Incident Response Plan |
| | **RS.AN: 事件分析 (Analysis)** | RS.AN-01: 分析攻擊日誌，判斷是源於提示注入、惡意工具利用還是數據中毒，並追溯攻擊路徑。 | Digital Forensics |
| **復原 (RECOVER)** | **RC.RP: 復原計畫 (Recovery Planning)** | RC.RP-01: 建立程序，在確認安全後，將 AI 應用及其脈絡配置恢復至上一個已知的安全狀態。 | Business Continuity Plan |
| | **RC.IM: 改善與教訓 (Improvements)** | RC.IM-01: 將事件的根本原因反饋給開發團隊，用於加固角色脈絡的護欄或修補工具脈絡中的安全漏洞。 | Lessons Learned Process |

#### **4. 實施層級 (Implementation Tiers)**

本框架採用四個層級來衡量公司在 AI 脈絡安全管理上的成熟度：

*   **層級 1 (部分實施):** AI 脈絡安全管理是非正式的、個案處理的。風險管理多為事後應對。
*   **層級 2 (風險通報):** 管理層已意識到 AI 脈絡的風險，已有部分政策和流程，但未全面實施。
*   **層級 3 (可重複):** 已有正式批准的政策和標準化流程，並在全公司範圍內一致地實施與監控。
*   **層級 4 (自適應):** 基於過往事件和預測性指標，能夠主動調整和改善脈絡安全控制，實現近乎即時的威脅應對。

#### **5. 框架設定檔 (Framework Profile)**

各業務單位與開發團隊應基於本 CCSF 核心，根據其具體 AI 應用（如：「客服中心 AI 助理」或「內部開發 Copilot」）的業務需求和風險狀況，建立自己的「框架設定檔」。該設定檔將明確指出其目標是達到哪個實施層級，並選擇具體需要落實的子類別控制項。

#### **6. 結論**

生成式 AI 的力量源於其「脈絡」，但其風險同樣根植於此。CCSF 框架提供了一個前瞻性的結構，使我們能夠在享受 AI 帶來效率提升的同時，系統性、主動地管理其獨特的網路安全挑戰，將「脈絡安全」打造成為我們企業的核心競爭力之一。