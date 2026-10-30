import {
  Button,
  Callout,
  Checkbox,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  Pill,
  Row,
  Select,
  Stack,
  Stat,
  Table,
  Text,
  TextArea,
  TextInput,
  Toggle,
  useCanvasState,
  useEffect,
  useHostTheme,
  useRef,
  useState,
} from "cursor/canvas";

type Kids = Parameters<typeof Stack>[0]["children"];
type Persona = "guest" | "member" | "admin";
type Tab = "项目" | "善款" | "我的";
type GiftFilter = "全部" | "已安排" | "尚未安排";
type ProjectFilter = "全部" | "进行中" | "已完成" | "已关闭" | "超支";
type ScreenId =
  | "u-projects"
  | "u-project"
  | "u-gifts"
  | "u-login"
  | "u-reset"
  | "u-mine"
  | "u-records"
  | "u-edit"
  | "u-benefit"
  | "a-gifts"
  | "a-entry"
  | "a-import"
  | "a-correct"
  | "a-void"
  | "a-void-batch"
  | "a-identities"
  | "a-identity-new"
  | "a-identity"
  | "a-identity-edit"
  | "a-pick-gift"
  | "a-projects"
  | "a-project-new"
  | "a-project"
  | "a-project-edit"
  | "a-add-person"
  | "a-expense"
  | "a-expense-edit"
  | "a-progress"
  | "a-progress-edit"
  | "a-people"
  | "a-person-new"
  | "a-person"
  | "a-files"
  | "a-voided"
  | "a-admins";

type Project = {
  id: string;
  no: string;
  name: string;
  start: string;
  status: "进行中" | "已完成" | "已关闭";
  people: number;
  income: number;
  expense: number;
  summary: string;
  cover: boolean;
};

type Gift = {
  id: string;
  no: string;
  order: string;
  platform: "微信支付" | "支付宝";
  pid: string;
  phone: string;
  mask: string;
  display: string;
  anon: boolean;
  bio: string;
  amount: number;
  date: string;
  projectId: string;
  remark: string;
  userEdited: boolean;
  editedAt: string;
};

type Person = {
  id: string;
  name: string;
  idNo: string;
  mask: string;
  note: string;
  updated: string;
  projects: string[];
};

type Ctx = {
  persona: Persona;
  setPersona: (p: Persona) => void;
  screen: ScreenId;
  open: (id: ScreenId, notice?: string) => void;
  notice: string;
  projectId: string;
  showUserProject: (id: string, ret: ScreenId) => void;
  showAdminProject: (id: string) => void;
  returnTo: ScreenId;
  giftBack: ScreenId;
  donationId: string;
  showGift: (id: string) => void;
  openGift: (id: string, screen: ScreenId) => void;
  identityId: string;
  showIdentity: (id: string) => void;
  personId: string;
  showPerson: (id: string) => void;
  giftFilter: GiftFilter;
  setGiftFilter: (f: GiftFilter) => void;
  projectFilter: ProjectFilter;
  setProjectFilter: (f: ProjectFilter) => void;
  alsoWechat: boolean;
  setAlsoWechat: (v: boolean) => void;
  releasedAlipay: boolean;
  setReleasedAlipay: (v: boolean) => void;
  beneficiaryOn: boolean;
  setBeneficiaryOn: (v: boolean) => void;
  bindPlatform: string;
  setBindPlatform: (v: string) => void;
  bindPid: string;
  setBindPid: (v: string) => void;
  lockPerson: boolean;
  setLockPerson: (v: boolean) => void;
  pendingUnclaim: string;
  setPendingUnclaim: (key: string) => void;
  goneExpenses: string[];
  dropExpense: (no: string) => void;
  identityEdits: Record<string, { anon: boolean; display: string; bio: string }>;
  saveIdentityEdit: (id: string, anon: boolean, display: string, bio: string) => void;
  goneGifts: string[];
  voided: { id: string; at: string; reason: string }[];
  dropGift: (id: string, reason: string, at?: string) => void;
  passwordHints: Record<string, string>;
  setPasswordHint: (phone: string, hint: string) => void;
  adminWide: boolean;
  setAdminWide: (wide: boolean) => void;
};

const PROJECTS: Project[] = [
  {
    id: "xm3",
    no: "XM202610180003",
    name: "冬季取暖",
    start: "2026-10-18",
    status: "已关闭",
    people: 1,
    income: 0,
    expense: 0,
    summary: "为一名老人准备取暖物资，善款尚未到位。",
    cover: false,
  },
  {
    id: "xm1",
    no: "XM202610130001",
    name: "秋季助学",
    start: "2026-10-13",
    status: "进行中",
    people: 2,
    income: 775.5,
    expense: 1000,
    summary: "为两名学生提供本学期书本与交通补助。",
    cover: false,
  },
  {
    id: "xm2",
    no: "XM202610080002",
    name: "社区义诊",
    start: "2026-10-08",
    status: "已完成",
    people: 1,
    income: 200,
    expense: 180,
    summary: "社区卫生站一日义诊，含基础检查。",
    cover: false,
  },
];

const GIFTS: Gift[] = [
  {
    id: "sk3",
    no: "SK202610100003",
    order: "4200001100202610100003",
    platform: "微信支付",
    pid: "oXyz789",
    phone: "",
    mask: "",
    display: "",
    anon: false,
    bio: "",
    amount: 80,
    date: "2026-10-10",
    projectId: "",
    remark: "",
    userEdited: false,
    editedAt: "",
  },
  {
    id: "sk2",
    no: "SK202610020001",
    order: "2026100222001400000001",
    platform: "支付宝",
    pid: "2088xxxx",
    phone: "13900000000",
    mask: "139****0000",
    display: "张先生",
    anon: false,
    bio: "希望用于助学",
    amount: 500.5,
    date: "2026-10-02",
    projectId: "xm1",
    remark: "单笔录入",
    userEdited: true,
    editedAt: "2026-10-12 14:20",
  },
  {
    id: "sk1",
    no: "SK202610010002",
    order: "4200001100202610010002",
    platform: "微信支付",
    pid: "oAbc123",
    phone: "13800000000",
    mask: "138****0000",
    display: "",
    anon: true,
    bio: "",
    amount: 200,
    date: "2026-10-01",
    projectId: "xm1",
    remark: "来自公众号转发",
    userEdited: false,
    editedAt: "",
  },
  {
    id: "sk4",
    no: "SK202609200004",
    order: "2026092022001400000004",
    platform: "支付宝",
    pid: "2088yyyy",
    phone: "13700000000",
    mask: "137****0000",
    display: "",
    anon: true,
    bio: "",
    amount: 200,
    date: "2026-09-20",
    projectId: "xm2",
    remark: "",
    userEdited: false,
    editedAt: "",
  },
  {
    id: "sk6",
    no: "SK202610110006",
    order: "2026101122001400000006",
    platform: "支付宝",
    pid: "2088zzzz",
    phone: "",
    mask: "",
    display: "",
    anon: true,
    bio: "",
    amount: 40,
    date: "2026-10-11",
    projectId: "",
    remark: "",
    userEdited: false,
    editedAt: "",
  },
  {
    id: "sk7",
    no: "SK202609280007",
    order: "4200001100202609280007",
    platform: "微信支付",
    pid: "oFold001",
    phone: "",
    mask: "",
    display: "",
    anon: true,
    bio: "",
    amount: 30,
    date: "2026-09-28",
    projectId: "xm1",
    remark: "",
    userEdited: false,
    editedAt: "",
  },
  {
    id: "sk8",
    no: "SK202609250008",
    order: "2026092522001400000008",
    platform: "支付宝",
    pid: "2088fold2",
    phone: "",
    mask: "",
    display: "",
    anon: true,
    bio: "",
    amount: 20,
    date: "2026-09-25",
    projectId: "xm1",
    remark: "",
    userEdited: false,
    editedAt: "",
  },
  {
    id: "sk9",
    no: "SK202609220009",
    order: "4200001100202609220009",
    platform: "微信支付",
    pid: "oFold003",
    phone: "",
    mask: "",
    display: "",
    anon: true,
    bio: "",
    amount: 15,
    date: "2026-09-22",
    projectId: "xm1",
    remark: "",
    userEdited: false,
    editedAt: "",
  },
  {
    id: "sk10",
    no: "SK202609180010",
    order: "2026091822001400000010",
    platform: "支付宝",
    pid: "2088fold4",
    phone: "",
    mask: "",
    display: "",
    anon: true,
    bio: "",
    amount: 10,
    date: "2026-09-18",
    projectId: "xm1",
    remark: "",
    userEdited: false,
    editedAt: "",
  },
  ...([
    ["sk11", "SK202609170011", "4200001100202609170011", "微信支付", "oPage011", 12, "2026-09-17"],
    ["sk12", "SK202609160012", "2026091622001400000012", "支付宝", "2088page12", 18, "2026-09-16"],
    ["sk13", "SK202609150013", "4200001100202609150013", "微信支付", "oPage013", 26, "2026-09-15"],
    ["sk14", "SK202609140014", "2026091422001400000014", "支付宝", "2088page14", 33, "2026-09-14"],
    ["sk15", "SK202609130015", "4200001100202609130015", "微信支付", "oPage015", 41, "2026-09-13"],
    ["sk16", "SK202609120016", "2026091222001400000016", "支付宝", "2088page16", 15, "2026-09-12"],
    ["sk17", "SK202609110017", "4200001100202609110017", "微信支付", "oPage017", 22, "2026-09-11"],
    ["sk18", "SK202609100018", "2026091022001400000018", "支付宝", "2088page18", 37, "2026-09-10"],
    ["sk19", "SK202609090019", "4200001100202609090019", "微信支付", "oPage019", 19, "2026-09-09"],
    ["sk20", "SK202609080020", "2026090822001400000020", "支付宝", "2088page20", 28, "2026-09-08"],
    ["sk21", "SK202609070021", "4200001100202609070021", "微信支付", "oPage021", 16, "2026-09-07"],
    ["sk22", "SK202609060022", "2026090622001400000022", "支付宝", "2088page22", 45, "2026-09-06"],
    ["sk23", "SK202609050023", "4200001100202609050023", "微信支付", "oPage023", 31, "2026-09-05"],
    ["sk24", "SK202609040024", "2026090422001400000024", "支付宝", "2088page24", 24, "2026-09-04"],
    ["sk25", "SK202609030025", "4200001100202609030025", "微信支付", "oPage025", 13, "2026-09-03"],
    ["sk26", "SK202609020026", "2026090222001400000026", "支付宝", "2088page26", 39, "2026-09-02"],
  ] as const).map(([id, no, order, platform, pid, amount, date]) => ({
    id,
    no,
    order,
    platform,
    pid,
    phone: "",
    mask: "",
    display: "",
    anon: true,
    bio: "",
    amount,
    date,
    projectId: "",
    remark: "",
    userEdited: false,
    editedAt: "",
  })),
  {
    id: "sk27",
    no: "SK202610030027",
    order: "4200001100202610030027",
    platform: "微信支付",
    pid: "oAbc123",
    phone: "13800000000",
    mask: "138****0000",
    display: "",
    anon: true,
    bio: "",
    amount: 60,
    date: "2026-10-03",
    projectId: "xm1",
    remark: "渠道重复",
    userEdited: false,
    editedAt: "",
  },
  {
    id: "sk28",
    no: "SK202610040028",
    order: "2026100422001400000028",
    platform: "支付宝",
    pid: "2088xxxx",
    phone: "13900000000",
    mask: "139****0000",
    display: "张先生",
    anon: false,
    bio: "希望用于助学",
    amount: 120,
    date: "2026-10-04",
    projectId: "",
    remark: "",
    userEdited: true,
    editedAt: "2026-10-12 14:20",
  },
];

const PEOPLE: Person[] = [
  { id: "p1", name: "李明", idNo: "110101200801011234", mask: "110****1234", note: "高二，交通补助", updated: "2026-10-20", projects: ["xm1"] },
  { id: "p2", name: "王芳", idNo: "320102200901015678", mask: "320****5678", note: "初三，书本", updated: "2026-10-19", projects: ["xm1"] },
  { id: "p5", name: "陈静", idNo: "330106201203034567", mask: "330****4567", note: "课后辅导", updated: "2026-10-18", projects: [] },
  { id: "p6", name: "刘洋", idNo: "310101199901012222", mask: "310****2222", note: "助学", updated: "2026-10-17", projects: [] },
  { id: "p7", name: "周敏", idNo: "420106198801013333", mask: "420****3333", note: "营养餐", updated: "2026-10-16", projects: [] },
  { id: "p8", name: "吴强", idNo: "500103197701014444", mask: "500****4444", note: "职业培训", updated: "2026-10-15", projects: [] },
  { id: "p9", name: "郑洁", idNo: "210102196601015555", mask: "210****5555", note: "医疗补助", updated: "2026-10-14", projects: [] },
  { id: "p10", name: "黄伟", idNo: "610104195501016666", mask: "610****6666", note: "社区义诊", updated: "2026-10-13", projects: [] },
  { id: "p11", name: "马丽", idNo: "370102199201017777", mask: "370****7777", note: "书本", updated: "2026-10-12", projects: [] },
  { id: "p12", name: "徐涛", idNo: "130102198301018888", mask: "130****8888", note: "交通补助", updated: "2026-10-11", projects: [] },
  { id: "p13", name: "何静", idNo: "350102200201019999", mask: "350****9999", note: "校服", updated: "2026-10-10", projects: [] },
  { id: "p14", name: "高峰", idNo: "220102197001010000", mask: "220****0000", note: "取暖", updated: "2026-10-09", projects: [] },
  { id: "p3", name: "赵磊", idNo: "440103195501019012", mask: "440****9012", note: "社区义诊", updated: "2026-10-08", projects: ["xm2"] },
  { id: "p4", name: "孙奶奶", idNo: "510104194201014321", mask: "510****4321", note: "取暖物资", updated: "2026-10-07", projects: ["xm3"] },
];

const EXPENSES = [
  { projectId: "xm1", no: "KX202610150001", date: "2026-10-15", cat: "物资采购", amount: 820, note: "书本与文具" },
  { projectId: "xm1", no: "KX202610120003", date: "2026-10-12", cat: "交通食宿", amount: 40, note: "交通补助" },
  { projectId: "xm1", no: "KX202610110004", date: "2026-10-11", cat: "物资采购", amount: 30, note: "文具补充" },
  { projectId: "xm1", no: "KX202610100005", date: "2026-10-10", cat: "人员补贴", amount: 20, note: "发放协助" },
  { projectId: "xm1", no: "KX202610090006", date: "2026-10-09", cat: "其他", amount: 15, note: "邮寄" },
  { projectId: "xm1", no: "KX202610080007", date: "2026-10-08", cat: "物资采购", amount: 25, note: "练习本" },
  { projectId: "xm1", no: "KX202610070008", date: "2026-10-07", cat: "其他", amount: 10, note: "打印" },
  { projectId: "xm1", no: "KX202610060009", date: "2026-10-06", cat: "物资采购", amount: 10, note: "本子" },
  { projectId: "xm1", no: "KX202610050010", date: "2026-10-05", cat: "交通食宿", amount: 10, note: "公交" },
  { projectId: "xm1", no: "KX202610040011", date: "2026-10-04", cat: "其他", amount: 10, note: "通讯" },
  { projectId: "xm1", no: "KX202610030012", date: "2026-10-03", cat: "物资采购", amount: 10, note: "试卷" },
  { projectId: "xm2", no: "KX202610090001", date: "2026-10-09", cat: "人员补贴", amount: 180, note: "义诊志愿者补贴" },
];

const UPDATES = [
  { projectId: "xm1", no: "JZ202610160001", date: "2026-10-16", title: "书本已发放", body: "两名学生已领到本学期书本。", images: 1 },
  { projectId: "xm1", no: "JZ202610140002", date: "2026-10-14", title: "发放说明", body: "本周发放说明已更新。", images: 2 },
  { projectId: "xm1", no: "JZ202610150003", date: "2026-10-15", title: "交通补助已发出", body: "本周交通补助已打给两名学生。", images: 1 },
  { projectId: "xm1", no: "JZ202610130004", date: "2026-10-13", title: "文具已采购", body: "补充文具已买齐。", images: 1 },
  { projectId: "xm1", no: "JZ202610120005", date: "2026-10-12", title: "发放协助", body: "志愿者协助完成发放。", images: 0 },
];

const USER_PAGES: { id: ScreenId; label: string; section: string }[] = [
  { id: "u-projects", label: "项目列表", section: "4.1" },
  { id: "u-project", label: "项目详情", section: "4.2" },
  { id: "u-gifts", label: "善款捐赠明细", section: "4.4" },
  { id: "u-login", label: "我的 · 登录", section: "4.5" },
  { id: "u-reset", label: "我的 · 重置密码", section: "5.1" },
  { id: "u-mine", label: "我的 · 已登录", section: "5.2" },
  { id: "u-records", label: "捐款列表", section: "5.4" },
  { id: "u-edit", label: "修改身份", section: "5.6" },
];

const ADMIN_PAGES: { id: ScreenId; label: string; section: string }[] = [
  { id: "a-projects", label: "项目列表", section: "3.11" },
  { id: "a-project-new", label: "新建项目", section: "3.12" },
  { id: "a-project", label: "项目详情", section: "3.13" },
  { id: "a-project-edit", label: "编辑项目", section: "3.14" },
  { id: "a-add-person", label: "追加受益人", section: "3.15" },
  { id: "a-expense", label: "登记开销", section: "3.16" },
  { id: "a-expense-edit", label: "编辑开销", section: "3.16" },
  { id: "a-progress", label: "发布进展", section: "3.17" },
  { id: "a-pick-gift", label: "选择尚未安排的善款", section: "3.10" },
  { id: "a-gifts", label: "善款列表", section: "3.3" },
  { id: "a-entry", label: "单笔录入", section: "3.4" },
  { id: "a-import", label: "批量导入", section: "3.5" },
  { id: "a-void", label: "作废善款", section: "3.8" },
  { id: "a-void-batch", label: "批量作废", section: "3.8" },
  { id: "a-identities", label: "捐款身份", section: "3.2" },
  { id: "a-identity-new", label: "创建捐款身份", section: "3.2" },
  { id: "a-identity", label: "身份详情", section: "3.9" },
  { id: "a-identity-edit", label: "更正展示信息", section: "3.9" },
  { id: "a-people", label: "受益人列表", section: "3.18" },
  { id: "a-person-new", label: "新建受益人", section: "3.18" },
  { id: "a-person", label: "受益人详情", section: "3.19" },
  { id: "a-files", label: "导入文档", section: "3.22" },
  { id: "a-voided", label: "作废善款", section: "3.23" },
  { id: "a-admins", label: "管理员名单", section: "3.20" },
];

type BatchFile = { id: string; name: string; at: string; rows: number };
type Voided = { id: string; at: string; reason: string };

const VOIDED_SEED: Voided[] = [
  { id: "sk28", at: "2026-10-11 11:42", reason: "录错项目" },
  { id: "sk27", at: "2026-10-11 11:40", reason: "重复录入" },
];

function voidedRemark(remark: string, reason: string): string {
  const note = remark.trim();
  const why = reason.trim();
  if (!why) return note || "无";
  if (!note) return `作废原因：${why}`;
  return `${note}。作废原因：${why}`;
}

function voidStamp(at?: string): string {
  if (at) return at;
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

const IMPORT_FILE_SEED: BatchFile[] = [
  { id: "imp1", name: "善款导入-20261012.xlsx", at: "2026-10-12 09:18", rows: 2 },
  { id: "imp2", name: "善款导入-20261008.xlsx", at: "2026-10-08 16:02", rows: 15 },
];

const VOID_FILE_SEED: BatchFile[] = [
  { id: "void1", name: "善款作废-20261011.xlsx", at: "2026-10-11 11:40", rows: 2 },
];

function yuan(n: number): string {
  return `¥${n.toFixed(2)}`;
}

function projectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

function withoutGone(gone: string[]): Project[] {
  return PROJECTS.filter((project) => !gone.includes(project.id));
}

function giftProjectId(projectId: string, gone: string[]): string {
  return projectId && !gone.includes(projectId) ? projectId : "";
}

function giftById(id: string): Gift {
  return GIFTS.find((g) => g.id === id) ?? GIFTS[0];
}

function personById(id: string): Person {
  return PEOPLE.find((p) => p.id === id) ?? PEOPLE[0];
}

function publicName(g: Gift): string {
  if (g.anon) return "匿名捐款人";
  if (g.display) return g.display;
  return `${g.platform}捐款人`;
}

function balanceOf(p: Project): number {
  return Math.round((p.income - p.expense) * 100) / 100;
}

function isOver(p: Project): boolean {
  return balanceOf(p) < 0;
}

function AmountLine(props: { project: Project }) {
  const theme = useHostTheme();
  const over = isOver(props.project);
  const cells: { label: string; value: string; danger?: boolean }[] = [
    { label: "善款合计", value: yuan(props.project.income) },
    { label: "开销合计", value: yuan(props.project.expense) },
    { label: "结余", value: yuan(balanceOf(props.project)), danger: over },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, width: "100%", minWidth: 0 }}>
      {cells.map((cell) => (
        <div key={cell.label} style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: "20px", whiteSpace: "nowrap", color: cell.danger ? theme.accent.primary : theme.text.primary }}>{cell.value}</div>
          <Text size="small" tone="secondary" style={{ whiteSpace: "nowrap" }}>{cell.label}</Text>
        </div>
      ))}
    </div>
  );
}

function keptGifts(gone: string[]): Gift[] {
  return GIFTS.filter((gift) => !gone.includes(gift.id));
}

function sameIdentity(a: Gift, b: Gift): boolean {
  return a.platform === b.platform && a.pid === b.pid;
}

function isMyGift(ctx: Ctx, g: Gift): boolean {
  if (ctx.persona !== "member") return false;
  if (!ctx.releasedAlipay && g.platform === "支付宝" && g.pid === "2088xxxx") return true;
  if (ctx.alsoWechat && g.platform === "微信支付" && g.pid === "oAbc123") return true;
  return false;
}

function seesProject(ctx: Ctx, p: Project): boolean {
  return ctx.persona === "member" && ctx.beneficiaryOn && p.id === "xm1";
}

function tabOf(screen: ScreenId): Tab {
  if (screen === "u-projects" || screen === "u-project") return "项目";
  if (screen === "u-gifts") return "善款";
  return "我的";
}

function isAdminScreen(screen: ScreenId): boolean {
  return screen.startsWith("a-");
}

function pageMeta(screen: ScreenId): { label: string; section: string } {
  const hit = [...USER_PAGES, ...ADMIN_PAGES].find((p) => p.id === screen);
  return hit ?? { label: "微光", section: "" };
}

type Identity = {
  id: string;
  platform: "微信支付" | "支付宝";
  pid: string;
  phone: string;
  mask: string;
  display: string;
  anon: boolean;
  bio: string;
  userEdited: boolean;
  editedAt: string;
};

const EXTRA_IDENTITIES: Identity[] = [
  {
    id: "id0",
    platform: "微信支付",
    pid: "oNew001",
    phone: "",
    mask: "",
    display: "",
    anon: true,
    bio: "",
    userEdited: false,
    editedAt: "",
  },
];

function identityIdOf(g: { platform: string; pid: string }): string {
  return `${g.platform}|${g.pid}`;
}

function allIdentities(): Identity[] {
  const list: Identity[] = [...EXTRA_IDENTITIES];
  const seen = new Set(list.map((item) => item.id));
  for (const g of GIFTS) {
    const id = identityIdOf(g);
    if (seen.has(id)) continue;
    seen.add(id);
    list.push({
      id,
      platform: g.platform,
      pid: g.pid,
      phone: g.phone,
      mask: g.mask,
      display: g.display,
      anon: g.anon,
      bio: g.bio,
      userEdited: g.userEdited,
      editedAt: g.editedAt,
    });
  }
  return list;
}

function identityById(id: string, edits: Record<string, { anon: boolean; display: string; bio: string }> = {}): Identity {
  const item = allIdentities().find((row) => row.id === id) ?? allIdentities()[0];
  const edit = edits[item.id];
  if (!edit) return item;
  return { ...item, anon: edit.anon, display: edit.display, bio: edit.bio, userEdited: false, editedAt: "" };
}

function giftsOf(identity: Identity): Gift[] {
  return GIFTS.filter((g) => identityIdOf(g) === identity.id);
}

function identityLabel(item: Identity): string {
  if (item.anon) return "匿名捐款人";
  if (item.display) return item.display;
  return `${item.platform}捐款人`;
}

function Field(props: { label: string; hint?: string; children: Kids }) {
  return (
    <Stack gap={4}>
      <Text size="small" weight="semibold">{props.label}</Text>
      {props.children}
      {props.hint ? <Text size="small" tone="tertiary">{props.hint}</Text> : null}
    </Stack>
  );
}

const PAGE_SIZE = 10;

function hasText(value: string, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return value.toLowerCase().includes(needle);
}

function inDates(date: string, from: string, to: string): boolean {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function normalizePageSize(size: number): number {
  return PAGE_SIZE_OPTIONS.indexOf(size) >= 0 ? size : PAGE_SIZE;
}

function takePage<T>(rows: T[], page: number, infinite = false, pageSize = PAGE_SIZE): T[] {
  const size = infinite ? PAGE_SIZE : normalizePageSize(pageSize);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(Math.max(1, page), pages);
  if (infinite) return rows.slice(0, current * size);
  const start = (current - 1) * size;
  return rows.slice(start, start + size);
}

function pageMarks(current: number, pages: number): number[] {
  const near = 5;
  let start = current - Math.floor((near - 1) / 2);
  let end = start + near - 1;
  if (start < 1) {
    end += 1 - start;
    start = 1;
  }
  if (end > pages) {
    start -= end - pages;
    end = pages;
  }
  start = Math.max(1, start);
  const marks = new Set<number>();
  if (pages >= 1) {
    marks.add(1);
    marks.add(pages);
  }
  for (let n = start; n <= end; n += 1) marks.add(n);
  return [...marks].sort((a, b) => a - b);
}

function QueryActions(props: { onSearch: () => void; onReset: () => void }) {
  return (
    <Row gap={8} justify="end">
      <Button variant="ghost" onClick={props.onReset}>清除</Button>
      <Button variant="secondary" onClick={props.onSearch}>查询</Button>
    </Row>
  );
}

type QueryKind = "key" | "name" | "category" | "time" | "other";

type QueryField = {
  id: string;
  label: string;
  kind: QueryKind;
  options?: string[];
  choices?: "radio";
  placeholder?: string;
};

function fieldBlank(field: QueryField): string {
  return field.options?.includes("全部") ? "全部" : "";
}

function blankQuery(fields: QueryField[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of fields) values[field.id] = fieldBlank(field);
  return values;
}

function queryText(values: Record<string, string>, id: string): string {
  return (values[id] ?? "").trim();
}

function queryActive(fields: QueryField[], values: Record<string, string>): boolean {
  return fields.some((field) => {
    const value = queryText(values, field.id);
    if (!value) return false;
    if (field.options?.includes("全部") && value === "全部") return false;
    return true;
  });
}

function mobileValues(fields: QueryField[], values: Record<string, string>): Record<string, string> {
  const named = fields.some((field) => field.kind === "name" || field.kind === "category");
  const next: Record<string, string> = {};
  for (const field of fields) {
    const keep = named ? field.kind === "name" || field.kind === "category" : field.kind === "key";
    next[field.id] = keep ? (values[field.id] ?? fieldBlank(field)) : fieldBlank(field);
  }
  return next;
}

function QueryControl(props: { field: QueryField; value: string; onChange: (value: string) => void }) {
  if (props.field.options && props.field.choices === "radio") {
    const current = props.value || fieldBlank(props.field);
    return (
      <Field label={props.field.label}>
        <Row gap={8} wrap>
          {props.field.options.map((option) => (
            <Button key={option} type="button" variant={current === option ? "primary" : "secondary"} onClick={() => props.onChange(option)}>
              {option}
            </Button>
          ))}
        </Row>
      </Field>
    );
  }
  if (props.field.options) {
    return (
      <Field label={props.field.label}>
        <Select
          value={props.value || fieldBlank(props.field)}
          onChange={props.onChange}
          options={props.field.options.map((value) => ({ value, label: value }))}
        />
      </Field>
    );
  }
  return (
    <Field label={props.field.label}>
      <TextInput value={props.value} onChange={props.onChange} placeholder={props.field.placeholder} />
    </Field>
  );
}

function QueryForm(props: { wide: boolean; fields: QueryField[]; onApply: (values: Record<string, string>) => void; showFold?: boolean }) {
  const [draft, setDraft] = useState<Record<string, string>>(() => blankQuery(props.fields));
  const draftRef = useRef(draft);
  const fieldsRef = useRef(props.fields);
  const applyRef = useRef(props.onApply);
  const wideRef = useRef(props.wide);
  draftRef.current = draft;
  fieldsRef.current = props.fields;
  applyRef.current = props.onApply;
  useEffect(() => {
    if (wideRef.current === props.wide) return;
    wideRef.current = props.wide;
    if (props.wide || props.showFold) return;
    const next = mobileValues(fieldsRef.current, draftRef.current);
    setDraft(next);
    applyRef.current(next);
  }, [props.wide, props.showFold]);
  const named = props.fields.some((field) => field.kind === "name" || field.kind === "category");
  const shown = props.fields.filter((field) => {
    if (props.wide || props.showFold) return field.kind === "key" || field.kind === "name" || field.kind === "category";
    return named ? field.kind === "name" || field.kind === "category" : field.kind === "key";
  });
  const folded = props.fields.filter((field) => field.kind === "time" || field.kind === "other");
  const write = (id: string, value: string) => {
    const next = { ...draft, [id]: value };
    setDraft(next);
    if (!props.wide) props.onApply(next);
  };
  const control = (field: QueryField) => (
    <QueryControl key={field.id} field={field} value={draft[field.id] ?? fieldBlank(field)} onChange={(value) => write(field.id, value)} />
  );
  return (
    <Stack gap={8}>
      {shown.length > 0 ? <Grid columns={props.wide ? 2 : 1} gap={8}>{shown.map(control)}</Grid> : null}
      {(props.wide || props.showFold) && folded.length > 0 ? (
        <CollapsibleSection title="更多条件">
          <Grid columns={props.wide ? 2 : 1} gap={8}>{folded.map(control)}</Grid>
        </CollapsibleSection>
      ) : null}
      {props.wide ? (
        <QueryActions
          onSearch={() => props.onApply(draft)}
          onReset={() => {
            const next = blankQuery(props.fields);
            setDraft(next);
            props.onApply(next);
          }}
        />
      ) : null}
    </Stack>
  );
}

function Pager(props: { page: number; total: number; onPage: (page: number) => void; infinite?: boolean; hideTotal?: boolean; pageSize?: number; onPageSize?: (size: number) => void }) {
  const theme = useHostTheme();
  const pageSize = normalizePageSize(props.pageSize ?? PAGE_SIZE);
  const pages = Math.max(1, Math.ceil(props.total / pageSize));
  const page = Math.min(Math.max(1, props.page), pages);
  const more = Boolean(props.infinite) && page < pages && props.total > 0;
  const sentinel = useRef<HTMLDivElement | null>(null);
  const [jump, setJump] = useState(String(page));
  useEffect(() => { setJump(String(page)); }, [page]);
  useEffect(() => {
    const node = sentinel.current;
    if (!more || !node) return;
    let root: HTMLElement | null = node.parentElement;
    while (root) {
      const overflow = getComputedStyle(root).overflowY;
      if (overflow === "auto" || overflow === "scroll") break;
      root = root.parentElement;
    }
    let closed = false;
    const observer = new IntersectionObserver((entries) => {
      if (closed) return;
      if (entries.some((entry) => entry.isIntersecting)) {
        closed = true;
        observer.disconnect();
        props.onPage(page + 1);
      }
    }, { root });
    observer.observe(node);
    return () => {
      closed = true;
      observer.disconnect();
    };
  }, [more, page, props.total, props.onPage]);
  const marks = pageMarks(page, pages);
  const go = (next: number) => {
    if (next < 1 || next > pages || next === page) return;
    props.onPage(next);
  };
  const commitJump = () => {
    const next = Number(jump);
    if (!Number.isInteger(next) || next < 1) {
      setJump(String(page));
      return;
    }
    go(Math.min(next, pages));
    setJump(String(Math.min(next, pages)));
  };
  if (props.infinite) {
    if (!more && props.hideTotal) return null;
    return (
      <Stack gap={8}>
        {more ? (
          <div ref={sentinel}>
            <Text size="small" tone="tertiary">正在加载</Text>
          </div>
        ) : null}
        {props.hideTotal ? null : <Text size="small" tone="tertiary">共 {props.total} 条</Text>}
      </Stack>
    );
  }
  const arrow = (label: string, target: number, enabled: boolean) => (
    <button
      onClick={() => go(target)}
      disabled={!enabled}
      style={{
        border: "none",
        background: "transparent",
        color: enabled ? theme.text.secondary : theme.text.tertiary,
        cursor: enabled ? "pointer" : "default",
        fontSize: 14,
        padding: "0 4px",
      }}
    >
      {label}
    </button>
  );
  const piece = (key: string, node: Kids) => (
    <span key={key} style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center" }}>{node}</span>
  );
  return (
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 12, maxWidth: "100%" }}>
      {piece("total", <Text size="small">共 {props.total} 条</Text>)}
      {props.total > 0 ? piece("size", (
        <Select
          value={String(pageSize)}
          onChange={(value) => {
            const next = Number(value);
            props.onPageSize?.(next);
            props.onPage(1);
          }}
          options={PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: `${size}条/页` }))}
          style={{ width: 96, flex: "0 0 auto" }}
        />
      )) : null}
      {props.total > 0 ? piece("prev", arrow("<", page - 1, page > 1)) : null}
      {props.total > 0 ? marks.map((n, index) => {
        const prev = index > 0 ? marks[index - 1] : n;
        const current = n === page;
        return (
          <span key={n} style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", gap: 8 }}>
            {n - prev > 1 ? <Text size="small" tone="tertiary">…</Text> : null}
            <button
              onClick={() => go(n)}
              style={{
                border: "none",
                background: "transparent",
                color: current ? theme.accent.primary : theme.text.primary,
                fontWeight: current ? 600 : 400,
                cursor: "pointer",
                fontSize: 13,
                padding: "0 2px",
              }}
            >
              {n}
            </button>
          </span>
        );
      }) : null}
      {props.total > 0 ? piece("next", arrow(">", page + 1, page < pages)) : null}
      {props.total > 0 ? piece("jump", (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Text size="small">前往</Text>
          <input
            value={jump}
            onChange={(event: { target: { value: string } }) => setJump(event.target.value.replace(/[^\d]/g, ""))}
            onBlur={commitJump}
            onKeyDown={(event: { key: string }) => {
              if (event.key === "Enter") commitJump();
            }}
            style={{
              width: 48,
              height: 28,
              boxSizing: "border-box",
              textAlign: "center",
              border: `1px solid ${theme.stroke.primary}`,
              borderRadius: theme.radius.sm,
              background: theme.bg.editor,
              color: theme.text.primary,
              fontSize: 13,
            }}
          />
          <Text size="small">页</Text>
        </span>
      )) : null}
    </div>
  );
}

function SectionList<T>(props: {
  title: string;
  wide?: boolean;
  fields: QueryField[];
  rows: T[];
  match: (row: T, values: Record<string, string>) => boolean;
  empty: string;
  idleEmpty?: string;
  infinite?: boolean;
  columns?: { headers: string[]; align?: Array<"left" | "right" | "center" | undefined>; cells: (row: T) => Kids[] };
  render: (row: T) => Kids;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => blankQuery(props.fields));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const filtered = props.rows.filter((row) => props.match(row, values));
  const view = takePage(filtered, page, props.infinite, pageSize);
  const blank = queryActive(props.fields, values) ? props.empty : (props.rows.length === 0 ? (props.idleEmpty ?? props.empty) : props.empty);
  return (
    <Stack gap={8}>
      <Text weight="semibold">{props.title}</Text>
      <QueryForm wide={Boolean(props.wide)} fields={props.fields} onApply={(next) => { setValues(next); setPage(1); }} />
      {filtered.length === 0 ? <Text size="small" tone="secondary">{blank}</Text> : null}
      {!props.infinite && props.columns && view.length > 0 ? (
        <Table headers={props.columns.headers} columnAlign={props.columns.align} rows={view.map((row) => props.columns?.cells(row) ?? [])} striped />
      ) : view.map((row) => props.render(row))}
      <Pager page={page} total={filtered.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite={props.infinite} />
    </Stack>
  );
}

function SectionTitle(props: { title: string; action?: Kids }) {
  return (
    <Row justify="space-between" align="center" gap={8} style={{ flexWrap: "nowrap" }}>
      <Text as="span" weight="semibold">{props.title}</Text>
      {props.action}
    </Row>
  );
}

function FoldList<T>(props: {
  title: string;
  rows: T[];
  empty: string;
  wide?: boolean;
  fold?: boolean;
  step?: number;
  action?: Kids;
  columns?: { headers: string[]; align?: Array<"left" | "right" | "center" | undefined>; cells: (row: T) => Kids[] };
  render: (row: T) => Kids;
}) {
  const theme = useHostTheme();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(props.step ?? props.rows.length);
  const folding = props.fold !== false;
  const preview = folding && props.rows.length > 5 ? 3 : props.rows.length;
  const head = props.rows.slice(0, preview);
  const rest = props.rows.slice(preview);
  const asTable = Boolean(props.wide && props.columns);
  const heading = props.action ? <SectionTitle title={props.title} action={props.action} /> : <Text weight="semibold">{props.title}</Text>;
  const block = (rows: T[]) => {
    if (asTable && props.columns) {
      return (
        <Table
          headers={props.columns.headers}
          columnAlign={props.columns.align}
          rows={rows.map((row) => props.columns?.cells(row) ?? [])}
          striped
        />
      );
    }
    return rows.map((row) => props.render(row));
  };
  const fold = (label: string) => (
    <button
      type="button"
      onClick={() => setOpen((value) => !value)}
      style={{
        display: "block",
        width: "100%",
        margin: 0,
        padding: "4px 0",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        textAlign: "center",
        color: theme.text.link,
        font: "inherit",
        fontSize: 13,
      }}
    >
      {label}
    </button>
  );
  if (props.step && props.step > 0) {
    const count = Math.min(shown, props.rows.length);
    const more = count < props.rows.length;
    const expanded = count > props.step;
    const linkStyle = {
      margin: 0,
      padding: "4px 0",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: theme.text.link,
      font: "inherit",
      fontSize: 13,
    };
    const moreButton = (
      <button type="button" onClick={() => setShown((value) => value + (props.step ?? 0))} style={linkStyle}>
        {`查看更多${props.title}`}
      </button>
    );
    const collapseButton = (
      <button type="button" onClick={() => setShown(props.step ?? 0)} style={linkStyle}>
        {`收起更多${props.title}`}
      </button>
    );
    return (
      <Stack gap={8}>
        {heading}
        {props.rows.length === 0 ? <Text size="small" tone="secondary">{props.empty}</Text> : block(props.rows.slice(0, count))}
        {expanded && more ? (
          <Row justify="center" align="center" gap={16} style={{ flexWrap: "nowrap" }}>
            {collapseButton}
            {moreButton}
          </Row>
        ) : more ? (
          <Row justify="center">{moreButton}</Row>
        ) : expanded ? (
          <Row justify="center">{collapseButton}</Row>
        ) : null}
      </Stack>
    );
  }
  return (
    <Stack gap={8}>
      {heading}
      {props.rows.length === 0 ? <Text size="small" tone="secondary">{props.empty}</Text> : block(head)}
      {rest.length === 0 ? null : open ? (
        <Stack gap={8}>
          {fold(`收起更多${props.title}`)}
          {block(rest)}
          {rest.length >= 5 ? fold(`收起更多${props.title}`) : null}
        </Stack>
      ) : fold(`查看更多${props.title}`)}
    </Stack>
  );
}

function RecordCard(props: { name: string; status?: string; statusActive?: boolean; marks?: { label: string; active?: boolean }[]; trail?: string; aside?: Kids; date?: string; children?: Kids; action?: Kids; line?: boolean }) {
  const theme = useHostTheme();
  return (
    <div style={{ padding: "8px 0", borderBottom: props.line === false ? "none" : `1px solid ${theme.stroke.tertiary}` }}>
      <Stack gap={4}>
        <Row justify="space-between" align="center" gap={8}>
          <Row gap={6} align="center" wrap style={{ flex: 1, minWidth: 0 }}>
            <Text as="span" weight="semibold">{props.name}</Text>
            {props.status ? <Pill size="sm" active={props.statusActive}>{props.status}</Pill> : null}
            {props.marks?.map((mark) => <Pill key={mark.label} size="sm" active={mark.active}>{mark.label}</Pill>)}
            {props.trail ? <Text as="span" size="small" tone="secondary">{props.trail}</Text> : null}
            {props.aside}
          </Row>
          {props.date ? <Text size="small" tone="secondary" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>{props.date}</Text> : null}
        </Row>
        {props.children}
        {props.action ? <Row gap={6} justify="end" wrap>{props.action}</Row> : null}
      </Stack>
    </div>
  );
}

function Hit(props: { onClick: () => void; children: Kids; line?: boolean }) {
  const theme = useHostTheme();
  return (
    <button
      onClick={props.onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: "transparent",
        border: "none",
        borderBottom: props.line === false ? "none" : `1px solid ${theme.stroke.tertiary}`,
        padding: "10px 0",
        cursor: "pointer",
        color: "inherit",
        font: "inherit",
      }}
    >
      <Stack gap={2}>{props.children}</Stack>
    </button>
  );
}

function Reveal(props: { mask: string; full: string }) {
  const [open, setOpen] = useState(false);
  if (!props.full) return <Text size="small" tone="tertiary">未填写</Text>;
  return (
    <Button variant="ghost" onClick={() => setOpen((v) => !v)}>
      {open ? props.full : props.mask}
    </Button>
  );
}

function ProgressSlides(props: { count: number }) {
  const theme = useHostTheme();
  const [index, setIndex] = useState(0);
  if (props.count <= 0) return null;
  const shift = props.count === 0 ? 0 : (index * 100) / props.count;
  return (
    <Stack gap={4}>
      <div style={{ overflow: "hidden", borderRadius: theme.radius.sm }}>
        <div
          style={{
            display: "flex",
            width: `${props.count * 100}%`,
            transform: `translateX(-${shift}%)`,
          }}
        >
          {Array.from({ length: props.count }, (_, imageIndex) => (
            <div
              key={imageIndex}
              style={{
                width: `${100 / props.count}%`,
                height: 72,
                flexShrink: 0,
                background: theme.fill.tertiary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text size="small" tone="tertiary">图片</Text>
            </div>
          ))}
        </div>
      </div>
      {props.count > 1 ? (
        <Row justify="end" align="center" gap={8}>
          <Text size="small" tone="tertiary">{index + 1}/{props.count}</Text>
          <Button variant="ghost" onClick={() => setIndex((current) => (current + 1) % props.count)}>下一张</Button>
        </Row>
      ) : null}
    </Stack>
  );
}

function ProgressCard(props: {
  update: { no: string; date: string; title: string; body: string; images: number };
  onEdit?: () => void;
  onDelete?: () => void;
  sideBySide?: boolean;
  showNo?: boolean;
}) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        flex: props.sideBySide ? "1 1 200px" : undefined,
        maxWidth: props.sideBySide ? 240 : undefined,
        width: props.sideBySide ? undefined : "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: 12,
        border: `1px solid ${theme.stroke.tertiary}`,
        borderRadius: theme.radius.md,
        boxSizing: "border-box",
      }}
    >
      <Row justify="space-between" align="center" gap={8} style={{ flexWrap: "nowrap" }}>
        <Text as="span" weight="semibold" style={{ minWidth: 0 }}>{props.update.title}</Text>
        <Text as="span" size="small" tone="secondary" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>{props.update.date}</Text>
      </Row>
      {props.showNo === false ? null : <Text size="small" tone="tertiary">{props.update.no}</Text>}
      <Text size="small">{props.update.body}</Text>
      <ProgressSlides count={props.update.images} />
      {props.onEdit && props.onDelete ? (
        <Row gap={6} justify="end" style={{ marginTop: "auto" }}>
          <Button variant="ghost" onClick={props.onEdit}>编辑</Button>
          <Button variant="ghost" onClick={props.onDelete}>删除</Button>
        </Row>
      ) : null}
    </div>
  );
}

function Cover() {
  const theme = useHostTheme();
  return (
    <div
      style={{
        height: 92,
        background: theme.fill.tertiary,
        borderRadius: theme.radius.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text size="small" tone="tertiary">封面</Text>
    </div>
  );
}

function Mono(props: { children: string }) {
  const theme = useHostTheme();
  return (
    <pre
      style={{
        margin: 0,
        whiteSpace: "pre-wrap",
        fontSize: 12,
        lineHeight: "18px",
        color: theme.text.secondary,
        background: theme.fill.tertiary,
        padding: 8,
        borderRadius: theme.radius.sm,
      }}
    >
      {props.children}
    </pre>
  );
}

function Notice(props: { text: string }) {
  if (!props.text) return null;
  return <Callout tone="info">{props.text}</Callout>;
}

function Phone(props: { tab: Tab; onTab: (tab: Tab) => void; children: Kids; dialog?: Kids; stretch?: boolean }) {
  const theme = useHostTheme();
  const tabs: Tab[] = ["项目", "善款", "我的"];
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 360,
        height: 720,
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${theme.stroke.primary}`,
        borderRadius: theme.radius.xl,
        background: theme.bg.editor,
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${theme.stroke.tertiary}`, display: "flex", justifyContent: "center" }}>
        <Text weight="semibold">微光</Text>
      </div>
      <div
        className="glimmer-fit"
        style={{
          flex: 1,
          overflowX: "hidden",
          overflowY: "auto",
          padding: "12px 14px",
          display: props.stretch ? "flex" : undefined,
          flexDirection: props.stretch ? "column" : undefined,
          minHeight: props.stretch ? 0 : undefined,
          minWidth: 0,
          maxWidth: "100%",
        }}
      >
        {props.stretch ? props.children : <Stack gap={10}>{props.children}</Stack>}
      </div>
      <div style={{ display: "flex", borderTop: `1px solid ${theme.stroke.primary}` }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => props.onTab(tab)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              borderTop: props.tab === tab ? `2px solid ${theme.accent.primary}` : "2px solid transparent",
              color: props.tab === tab ? theme.accent.primary : theme.text.secondary,
              padding: "10px 0 12px",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {props.dialog}
    </div>
  );
}

function AdminLine(props: { children: Kids; action?: Kids }) {
  const theme = useHostTheme();
  return (
    <div style={{ padding: "8px 0", borderBottom: `1px solid ${theme.stroke.tertiary}` }}>
      <Row justify="space-between" align="center" gap={8}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Stack gap={2}>{props.children}</Stack>
        </div>
        {props.action}
      </Row>
    </div>
  );
}

function AdminFrame(props: { screen: ScreenId; ctx: Ctx; children: Kids; dialog?: Kids }) {
  const theme = useHostTheme();
  const [moreOpen, setMoreOpen] = useState(false);
  const items: { id: ScreenId; label: string; on: boolean }[] = [
    {
      id: "a-projects",
      label: "项目",
      on: ["a-projects", "a-project-new", "a-project", "a-project-edit", "a-add-person", "a-expense", "a-expense-edit", "a-progress", "a-progress-edit", "a-pick-gift"].includes(props.screen),
    },
    {
      id: "a-gifts",
      label: "善款",
      on: ["a-gifts", "a-entry", "a-import", "a-correct", "a-void", "a-void-batch"].includes(props.screen),
    },
    { id: "a-people", label: "受益人", on: ["a-people", "a-person-new", "a-person"].includes(props.screen) },
    {
      id: "a-identities",
      label: "捐款身份",
      on: ["a-identities", "a-identity-new", "a-identity", "a-identity-edit"].includes(props.screen),
    },
    { id: "a-files", label: "导入文档", on: props.screen === "a-files" },
    { id: "a-voided", label: "作废善款", on: props.screen === "a-voided" },
    { id: "a-admins", label: "管理员", on: props.screen === "a-admins" },
  ];
  const primary = items.filter((item) => item.id === "a-projects" || item.id === "a-gifts" || item.id === "a-people");
  const more = items.filter((item) => item.id === "a-identities" || item.id === "a-files" || item.id === "a-voided" || item.id === "a-admins");
  const moreOn = more.some((item) => item.on);
  const go = (id: ScreenId) => {
    setMoreOpen(false);
    if (id === "a-gifts") props.ctx.setGiftFilter("全部");
    if (id === "a-projects") props.ctx.setProjectFilter("全部");
    props.ctx.open(id);
  };
  if (!props.ctx.adminWide) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          height: 720,
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${theme.stroke.primary}`,
          borderRadius: theme.radius.xl,
          background: theme.bg.editor,
          overflow: "hidden",
          minWidth: 0,
          position: "relative",
        }}
      >
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${theme.stroke.tertiary}` }}>
          <Row justify="space-between" align="center">
            <Stack gap={0}>
              <Text weight="semibold">微光</Text>
              <Text size="small" tone="tertiary">管理端 · 移动</Text>
            </Stack>
            <Button variant="ghost" onClick={() => props.ctx.open(props.ctx.persona === "guest" ? "u-login" : "u-mine")}>
              返回「我的」
            </Button>
          </Row>
        </div>
        <div className="glimmer-fit" style={{ flex: 1, overflowX: "hidden", overflowY: "auto", padding: "12px 14px", minWidth: 0, maxWidth: "100%" }}>
          <Stack gap={10}>{props.children}</Stack>
        </div>
        <div style={{ borderTop: `1px solid ${theme.stroke.primary}`, background: theme.bg.editor }}>
          {moreOpen ? (
            <Stack gap={0}>
              {more.map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  style={{
                    textAlign: "left",
                    background: item.on ? theme.fill.tertiary : "transparent",
                    color: item.on ? theme.text.primary : theme.text.secondary,
                    border: "none",
                    borderBottom: `1px solid ${theme.stroke.tertiary}`,
                    padding: "10px 14px",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </Stack>
          ) : null}
          <div style={{ display: "flex" }}>
            {primary.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  borderTop: item.on ? `2px solid ${theme.accent.primary}` : "2px solid transparent",
                  color: item.on ? theme.accent.primary : theme.text.secondary,
                  padding: "10px 0 12px",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setMoreOpen((open) => !open)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                borderTop: moreOn || moreOpen ? `2px solid ${theme.accent.primary}` : "2px solid transparent",
                color: moreOn || moreOpen ? theme.accent.primary : theme.text.secondary,
                padding: "10px 0 12px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              其他
            </button>
          </div>
        </div>
        {props.dialog}
      </div>
    );
  }
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        minHeight: 720,
        display: "flex",
        border: `1px solid ${theme.stroke.primary}`,
        borderRadius: theme.radius.lg,
        background: theme.bg.editor,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{ width: 132, flexShrink: 0, background: theme.bg.chrome, borderRight: `1px solid ${theme.stroke.tertiary}`, padding: 12 }}>
        <Stack gap={12}>
          <Stack gap={2}>
            <Text weight="semibold">微光</Text>
            <Text size="small" tone="tertiary">管理端 · 桌面</Text>
          </Stack>
          <Stack gap={4}>
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                style={{
                  textAlign: "left",
                  background: item.on ? theme.fill.tertiary : "transparent",
                  color: item.on ? theme.text.primary : theme.text.secondary,
                  border: "none",
                  borderLeft: item.on ? `2px solid ${theme.accent.primary}` : "2px solid transparent",
                  padding: "6px 8px",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {item.label}
              </button>
            ))}
          </Stack>
          <Button variant="ghost" onClick={() => props.ctx.open(props.ctx.persona === "guest" ? "u-login" : "u-mine")}>
            返回「我的」
          </Button>
        </Stack>
      </div>
      <div className="glimmer-fit" style={{ flex: 1, minWidth: 0, maxWidth: "100%", maxHeight: 760, overflowX: "hidden", overflowY: "auto", padding: 16 }}>
        <Stack gap={12}>{props.children}</Stack>
      </div>
      {props.dialog}
    </div>
  );
}

function PublicGiftLine(props: { g: Gift; ctx: Ctx; linkProject: boolean; backTo?: ScreenId }) {
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const projectId = giftProjectId(props.g.projectId, gone);
  const project = projectId ? projectById(projectId) : undefined;
  return (
    <RecordCard
      name={publicName(props.g)}
      marks={isMyGift(props.ctx, props.g) ? [{ label: "我的捐款", active: true }] : undefined}
      date={props.g.date}
    >
      <Text size="small" tone="secondary">{yuan(props.g.amount)} · {props.g.platform}</Text>
      {props.linkProject ? (
        project ? (
          <Row justify="start">
            <Button variant="ghost" onClick={() => props.ctx.showUserProject(project.id, props.backTo ?? "u-gifts")}>{project.name}</Button>
          </Row>
        ) : (
          <Text size="small" tone="tertiary">尚未安排到具体项目</Text>
        )
      ) : null}
    </RecordCard>
  );
}

function ProjectLines(props: { p: Project; admin?: boolean }) {
  const p = props.p;
  return (
    <>
      <Row justify="space-between" align="center" gap={8}>
        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
          <Row gap={6} align="center" wrap>
            <Text weight="semibold">{p.name}</Text>
            <Pill size="sm" active={p.status === "进行中"}>{p.status}</Pill>
            {props.admin && isOver(p) ? <Pill size="sm" active>超支</Pill> : null}
          </Row>
          {props.admin ? <Text size="small" tone="tertiary">{p.no}</Text> : null}
        </Stack>
        <Text size="small" tone="secondary" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>{p.start}</Text>
      </Row>
      <Text size="small" tone="secondary">
        {props.admin
          ? `善款 ${yuan(p.income)} · 开销 ${yuan(p.expense)} · 结余 ${yuan(balanceOf(p))}`
          : `善款 ${yuan(p.income)} · 开销 ${yuan(p.expense)}`}
      </Text>
      <Text size="small" tone="secondary">{p.people} 名受益人</Text>
    </>
  );
}

function UserProjects(props: { ctx: Ctx }) {
  const fields: QueryField[] = [
    { id: "name", label: "项目名称", kind: "name", placeholder: "项目名称" },
    { id: "status", label: "状态", kind: "category", choices: "radio", options: ["全部", "进行中", "已完成", "已关闭"] },
  ];
  const [query, setQuery] = useState<Record<string, string>>(() => blankQuery(fields));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const status = query.status ?? "全部";
  const filtered = withoutGone(gone).filter((project) => (status === "全部" || project.status === status) && hasText(project.name, queryText(query, "name")))
    .slice()
    .sort((a, b) => b.start.localeCompare(a.start));
  const rows = takePage(filtered, page, true, pageSize);
  return (
    <Stack gap={10}>
      <QueryForm wide={false} fields={fields} onApply={(next) => { setQuery(next); setPage(1); }} />
      {filtered.length === 0 ? <Text tone="secondary">没有符合条件的项目。</Text> : null}
      {rows.map((project) => (
        <Hit key={project.id} onClick={() => props.ctx.showUserProject(project.id, "u-projects")}>
          <ProjectLines p={project} />
        </Hit>
      ))}
      <Pager page={page} total={filtered.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite />
    </Stack>
  );
}

function UserProject(props: { ctx: Ctx }) {
  const project = projectById(props.ctx.projectId) ?? PROJECTS[1];
  const gifts = keptGifts(props.ctx.goneGifts).filter((g) => g.projectId === project.id).sort((a, b) => b.date.localeCompare(a.date));
  const expenses = EXPENSES.filter((e) => e.projectId === project.id && !props.ctx.goneExpenses.includes(e.no)).sort((a, b) => b.date.localeCompare(a.date));
  const updates = UPDATES.filter((u) => u.projectId === project.id).sort((a, b) => b.date.localeCompare(a.date));
  const back = props.ctx.returnTo.startsWith("u-") ? props.ctx.returnTo : "u-projects";
  return (
    <Stack gap={10}>
      <Button variant="ghost" onClick={() => props.ctx.open(back)}>返回</Button>
      <Row gap={6} align="center" wrap>
        <Text weight="semibold">{project.name}</Text>
        <Pill size="sm" active={project.status === "进行中"}>{project.status}</Pill>
        {isOver(project) ? <Pill size="sm" active>超支</Pill> : null}
      </Row>
      {project.cover ? <Cover /> : null}
      <Text size="small">{project.summary}</Text>
      <Row gap={6} align="center" wrap>
        <Text as="span" size="small" tone="secondary">开始于 {project.start} · {project.people} 名受益人</Text>
        {seesProject(props.ctx, project) ? <Pill size="sm" active>包含我</Pill> : null}
      </Row>
      <AmountLine project={project} />
      <Divider />
      <FoldList
        title="进展"
        rows={updates}
        empty="暂无进展。"
        step={2}
        render={(update) => (
          <ProgressCard key={update.no} update={update} showNo={false} />
        )}
      />
      <Divider />
      <FoldList
        title="善款"
        rows={gifts}
        empty="帮助来源待补充。"
        step={5}
        render={(gift) => <PublicGiftLine key={gift.id} g={gift} ctx={props.ctx} linkProject={false} />}
      />
      <Divider />
      <FoldList
        title="开销"
        rows={expenses}
        empty="暂无开销。"
        step={5}
        render={(expense) => (
          <RecordCard key={expense.no} name={expense.cat} date={expense.date}>
            <Text size="small" tone="secondary">{yuan(expense.amount)} · {expense.note}</Text>
          </RecordCard>
        )}
      />
    </Stack>
  );
}

function UserGifts(props: { ctx: Ctx }) {
  const fields: QueryField[] = [
    { id: "bind", label: "项目", kind: "category", choices: "radio", options: ["全部", "已安排", "尚未安排"] },
    { id: "from", label: "捐款日期起", kind: "time", placeholder: "YYYY-MM-DD" },
    { id: "to", label: "捐款日期止", kind: "time", placeholder: "YYYY-MM-DD" },
  ];
  const [query, setQuery] = useState<Record<string, string>>(() => blankQuery(fields));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const bind = query.bind ?? "全部";
  const filtered = keptGifts(props.ctx.goneGifts)
    .filter((gift) => bind === "全部" || (bind === "已安排" ? Boolean(giftProjectId(gift.projectId, gone)) : !giftProjectId(gift.projectId, gone)))
    .filter((gift) => inDates(gift.date, queryText(query, "from"), queryText(query, "to")))
    .sort((a, b) => b.date.localeCompare(a.date));
  const rows = takePage(filtered, page, true, pageSize);
  return (
    <Stack gap={10}>
      <QueryForm wide={false} fields={fields} onApply={(next) => { setQuery(next); setPage(1); }} />
      {filtered.length === 0 ? <Text tone="secondary">没有符合条件的捐款记录。</Text> : null}
      {rows.map((gift) => <PublicGiftLine key={gift.id} g={gift} ctx={props.ctx} linkProject />)}
      <Pager page={page} total={filtered.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite />
    </Stack>
  );
}

function UserLogin(props: { ctx: Ctx }) {
  const theme = useHostTheme();
  const [mode, setMode] = useState<"password" | "code">("password");
  const [phone, setPhone] = useState(props.ctx.persona === "admin" ? "13800001001" : "13900000000");
  const [secret, setSecret] = useState("");
  const [hint, setHint] = useState("");
  const signIn = () => {
    if (props.ctx.persona === "guest") props.ctx.setPersona("member");
    props.ctx.open("u-mine", "登录成功，已停在「我的」。匹配到的捐款身份已自动认领。");
  };
  const passwordHint = props.ctx.passwordHints[phone] ?? "";
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Stack gap={10}>
      <Notice text={props.ctx.notice} />
      <div style={{ display: "flex", borderBottom: `1px solid ${theme.stroke.primary}` }}>
        {(["password", "code"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => { setMode(item); setHint(""); }}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              borderBottom: mode === item ? `2px solid ${theme.accent.primary}` : "2px solid transparent",
              color: mode === item ? theme.accent.primary : theme.text.secondary,
              marginBottom: -1,
              padding: "8px 0",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {item === "password" ? "密码登录" : "验证码登录"}
          </button>
        ))}
      </div>
      <Field label="手机号">
        <TextInput value={phone} onChange={setPhone} placeholder="11 位手机号" />
      </Field>
      {mode === "password" ? (
        <Stack gap={4}>
          <Row gap={8} align="center">
            <Text size="small" weight="semibold">密码</Text>
            {passwordHint ? <Text size="small" tone="secondary">{passwordHint}</Text> : null}
          </Row>
          <TextInput type="password" value={secret} onChange={setSecret} placeholder="密码" />
        </Stack>
      ) : (
        <Stack gap={8}>
          <Text size="small" tone="secondary">验证码 5 分钟内有效，同一手机号 1 小时内最多发送 5 次。</Text>
          <Row gap={8} justify="end">
            <Button variant="secondary" onClick={() => setHint("验证码已发送，5 分钟内有效。")}>获取验证码</Button>
          </Row>
          <Field label="验证码">
            <TextInput value={secret} onChange={setSecret} placeholder="短信验证码" />
          </Field>
        </Stack>
      )}
      {hint ? <Callout tone="success" title="已发送">{hint}</Callout> : null}
      <Row gap={8} justify="end">
        <Button variant="primary" onClick={signIn}>登录</Button>
      </Row>
      <Text size="small" tone="tertiary">未登录时没有「进入后台」。管理员请先在上方选「管理员」，再点登录。</Text>
      </Stack>
      </div>
      <button
        type="button"
        onClick={() => props.ctx.open("u-reset")}
        style={{
          display: "block",
          width: "100%",
          margin: 0,
          padding: "8px 0 0",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "center",
          color: theme.text.link,
          font: "inherit",
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        重置密码
      </button>
    </div>
  );
}

function UserReset(props: { ctx: Ctx }) {
  const initialPhone = props.ctx.persona === "admin" ? "13800001001" : "13900000000";
  const [phone, setPhone] = useState(initialPhone);
  const [code, setCode] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [passwordHint, setPasswordHint] = useState(props.ctx.passwordHints[initialPhone] ?? "");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  return (
    <Stack gap={10}>
      <Button variant="ghost" onClick={() => props.ctx.open("u-login")}>返回</Button>
      <Text weight="semibold">重置密码</Text>
      <Text size="small" tone="secondary">用短信验证码确认手机号，再设置新密码。验证码 5 分钟内有效。</Text>
      <Field label="手机号">
        <TextInput
          value={phone}
          onChange={(value) => {
            setPhone(value);
            setPasswordHint(props.ctx.passwordHints[value] ?? "");
          }}
          placeholder="11 位手机号"
        />
      </Field>
      <Row gap={8} justify="end">
        <Button variant="secondary" onClick={() => { setError(""); setHint("验证码已发送，5 分钟内有效。"); }}>获取验证码</Button>
      </Row>
      <Field label="验证码">
        <TextInput value={code} onChange={setCode} placeholder="短信验证码" />
      </Field>
      <Field label="新密码">
        <TextInput type="password" value={next} onChange={setNext} placeholder="至少 8 位" />
      </Field>
      <Field label="确认新密码">
        <TextInput type="password" value={again} onChange={setAgain} placeholder="再输入一次" />
      </Field>
      <Stack gap={4}>
        <Row gap={8} align="center">
          <Text size="small" weight="semibold">密码提示</Text>
          <Text size="small" tone="tertiary">非必填</Text>
        </Row>
        <TextInput value={passwordHint} onChange={setPasswordHint} placeholder="方便下次想起密码" />
      </Stack>
      {hint ? <Callout tone="success" title="已发送">{hint}</Callout> : null}
      {error ? <Callout tone="warning" title="未能重置">{error}</Callout> : null}
      <Row gap={8} justify="end">
        <Button
          variant="primary"
          onClick={() => {
            if (next.length < 8) {
              setError("密码至少 8 位。");
              return;
            }
            if (next !== again) {
              setError("两次输入的密码不一致。");
              return;
            }
            props.ctx.setPasswordHint(phone, passwordHint.trim());
            props.ctx.open("u-login", "密码已重置。请用手机号和新密码登录。");
          }}
        >
          确认重置
        </Button>
      </Row>
    </Stack>
  );
}

function UserMine(props: { ctx: Ctx }) {
  const theme = useHostTheme();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const [bindOpen, setBindOpen] = useCanvasState("mine-bind-open", false);
  const [benefitOpen, setBenefitOpen] = useCanvasState("mine-benefit-open", false);
  if (props.ctx.persona === "guest") {
    return (
      <Stack gap={8}>
        <Callout tone="info" title="尚未登录">捐赠身份、受益人身份和「进入后台」在登录成功后才出现。</Callout>
        <Row justify="end">
          <Button variant="primary" onClick={() => props.ctx.open("u-login")}>前往登录</Button>
        </Row>
      </Stack>
    );
  }
  const member = props.ctx.persona === "member";
  const identities: { key: string; platform: string; name: string; anon: string; giftId: string }[] = [];
  if (member && !props.ctx.releasedAlipay) {
    identities.push({ key: "ali", platform: "支付宝", name: "张先生", anon: "不匿名", giftId: "sk2" });
  }
  if (member && props.ctx.alsoWechat) {
    identities.push({ key: "wx", platform: "微信支付", name: "匿名捐款人", anon: "匿名", giftId: "sk1" });
  }
  const total = identities.reduce((sum, item) => sum + (item.key === "ali" ? 500.5 : 200), 0);
  return (
    <Stack gap={12}>
      <Notice text={props.ctx.notice} />
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flexWrap: "nowrap", gap: 8, width: "100%" }}>
        <Text as="span" weight="semibold" style={{ whiteSpace: "nowrap", flex: "0 0 auto", width: "auto" }}>{member ? "139****0000" : "138****1001"}</Text>
        <Button
          variant="ghost"
          style={{ whiteSpace: "nowrap", flex: "0 0 auto", width: "auto" }}
          onClick={() => {
            props.ctx.setPersona("guest");
            props.ctx.open("u-projects", "已退出。公开的项目和善款仍可查看。");
          }}
        >
          退出
        </Button>
        {props.ctx.persona === "admin" ? (
          <Button variant="primary" style={{ whiteSpace: "nowrap", flex: "0 0 auto", width: "auto" }} onClick={() => { props.ctx.setProjectFilter("全部"); props.ctx.open("a-projects"); }}>进入后台</Button>
        ) : null}
      </div>
      <Text weight="semibold">我的捐赠</Text>
      <Row gap={12} wrap>
        <Stat value={yuan(total)} label="累计捐款" />
        <Stat value={yuan(total)} label="已进入项目" />
        <Stat value={yuan(0)} label="尚未安排" />
      </Row>
      {identities.length === 0 ? <Text size="small" tone="secondary">当前没有已认领的捐赠身份。</Text> : null}
      {takePage(identities, page, true, pageSize).map((item, index, all) => (
        <RecordCard
          key={item.key}
          line={index < all.length - 1}
          name={item.name}
          status={item.anon}
          statusActive={item.anon === "不匿名"}
          trail={item.platform}
          action={
            <>
              <Button variant="ghost" onClick={() => props.ctx.setPendingUnclaim(item.key)}>解除绑定</Button>
              <Button variant="ghost" onClick={() => { props.ctx.showGift(item.giftId); props.ctx.open("u-edit"); }}>修改对外资料</Button>
              <Button variant="secondary" onClick={() => { props.ctx.showGift(item.giftId); props.ctx.open("u-records"); }}>打开</Button>
            </>
          }
        />
      ))}
      <Pager page={page} total={identities.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite hideTotal />
      <button
        type="button"
        onClick={() => setBindOpen((open) => !open)}
        style={{
          display: "block",
          width: "100%",
          margin: 0,
          padding: "4px 0",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "center",
          color: theme.text.link,
          font: "inherit",
          fontSize: 13,
        }}
      >
        {bindOpen ? "收起绑定捐赠身份" : "绑定捐赠身份"}
      </button>
      {bindOpen ? <UserBind ctx={props.ctx} /> : null}
      <Divider />
      <Text weight="semibold">我的受益</Text>
      {member && props.ctx.beneficiaryOn ? <BoundBeneficiary onRelease={() => props.ctx.setBeneficiaryOn(false)} /> : (
        <>
          <button
            type="button"
            onClick={() => setBenefitOpen((open) => !open)}
            style={{
              display: "block",
              width: "100%",
              margin: 0,
              padding: "4px 0",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "center",
              color: theme.text.link,
              font: "inherit",
              fontSize: 13,
            }}
          >
            {benefitOpen ? "收起绑定受益人身份" : "绑定受益人身份"}
          </button>
          {benefitOpen ? <BeneficiaryForm ctx={props.ctx} onBound={() => setBenefitOpen(false)} /> : null}
        </>
      )}
      <IncludedProjects ctx={props.ctx} />
    </Stack>
  );
}

function BoundBeneficiary(props: { onRelease: () => void }) {
  const person = personById("p1");
  return (
    <Stack gap={6}>
      <Row gap={8} align="center" style={{ flexWrap: "nowrap" }}>
        <Text as="span" size="small" weight="semibold" style={{ whiteSpace: "nowrap", flex: "0 0 auto" }}>{person.name}</Text>
        <Reveal mask={person.mask} full={person.idNo} />
      </Row>
      <Row justify="end">
        <Button variant="ghost" onClick={props.onRelease}>解除绑定</Button>
      </Row>
    </Stack>
  );
}

function BeneficiaryForm(props: { ctx: Ctx; onBound: () => void }) {
  const [name, setName] = useState("");
  const [idNo, setIdNo] = useState("");
  const [error, setError] = useState(false);
  const [dup, setDup] = useState(false);
  const bound = props.ctx.persona === "member" && props.ctx.beneficiaryOn;
  return (
    <Stack gap={8}>
      <Field label="姓名">
        <TextInput value={name} onChange={setName} placeholder="与档案一致" />
      </Field>
      <Field label="唯一 ID" hint="去掉首尾空格后精确匹配。对不上时不说明是哪一项不对。">
        <TextInput value={idNo} onChange={setIdNo} placeholder="推荐身份证号" />
      </Field>
      {error ? <Callout tone="warning">未找到匹配的受益人信息。</Callout> : null}
      {dup ? <Callout tone="info">已经绑定。</Callout> : null}
      <Row justify="end">
        <Button
          variant="primary"
          onClick={() => {
            if (bound) {
              setDup(true);
              setError(false);
              return;
            }
            const ok = name.trim() === "李明" && idNo.trim() === "110101200801011234";
            setDup(false);
            setError(!ok);
            if (!ok) return;
            if (props.ctx.persona === "guest") props.ctx.setPersona("member");
            props.ctx.setBeneficiaryOn(true);
            props.onBound();
          }}
        >
          提交绑定
        </Button>
      </Row>
    </Stack>
  );
}

function IncludedProjects(props: { ctx: Ctx }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const show = props.ctx.persona === "member" && props.ctx.beneficiaryOn;
  if (!show) {
    return <Text size="small" tone="secondary">绑定受益人身份后，这里会列出包含自己的项目。</Text>;
  }
  const list = withoutGone(gone).filter((project) => project.id === "xm1");
  const rows = takePage(list, page, true, pageSize);
  return (
    <Stack gap={8}>
      {list.length === 0 ? <Text size="small" tone="secondary">暂时没有包含我的项目。</Text> : null}
      {rows.map((project, index, all) => (
        <Hit key={project.id} line={index < all.length - 1} onClick={() => props.ctx.showUserProject(project.id, "u-mine")}>
          <ProjectLines p={project} />
        </Hit>
      ))}
      <Pager page={page} total={list.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite hideTotal />
    </Stack>
  );
}

function UserRecords(props: { ctx: Ctx }) {
  const seed = giftById(props.ctx.donationId);
  const fields: QueryField[] = [
    { id: "bind", label: "项目", kind: "category", choices: "radio", options: ["全部", "已安排", "尚未安排"] },
    { id: "from", label: "捐款日期起", kind: "time", placeholder: "YYYY-MM-DD" },
    { id: "to", label: "捐款日期止", kind: "time", placeholder: "YYYY-MM-DD" },
  ];
  const [query, setQuery] = useState<Record<string, string>>(() => blankQuery(fields));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const bind = query.bind ?? "全部";
  const list = keptGifts(props.ctx.goneGifts)
    .filter((gift) => sameIdentity(gift, seed))
    .filter((gift) => bind === "全部" || (bind === "已安排" ? Boolean(giftProjectId(gift.projectId, gone)) : !giftProjectId(gift.projectId, gone)))
    .filter((gift) => inDates(gift.date, queryText(query, "from"), queryText(query, "to")))
    .sort((a, b) => b.date.localeCompare(a.date));
  const rows = takePage(list, page, true, pageSize);
  const anon = seed.anon ? "匿名" : "不匿名";
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("u-mine")}>返回「我的」</Button>
      <RecordCard name={publicName(seed)} status={anon} statusActive={!seed.anon}>
        <Text size="small" tone="secondary">{seed.platform}</Text>
      </RecordCard>
      <QueryForm wide={false} fields={fields} onApply={(next) => { setQuery(next); setPage(1); }} />
      {list.length === 0 ? <Text size="small" tone="secondary">没有符合条件的捐款记录。</Text> : null}
      {rows.map((gift) => {
        const projectId = giftProjectId(gift.projectId, gone);
        const project = projectId ? projectById(projectId) : undefined;
        return (
          <RecordCard key={gift.id} name={yuan(gift.amount)} date={gift.date}>
            {project ? (
              <Row justify="start">
                <Button variant="ghost" onClick={() => props.ctx.showUserProject(project.id, "u-records")}>{project.name}</Button>
              </Row>
            ) : (
              <Text size="small" tone="tertiary">尚未安排到具体项目</Text>
            )}
          </RecordCard>
        );
      })}
      <Pager page={page} total={list.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite />
    </Stack>
  );
}

function UserBind(props: { ctx: Ctx }) {
  const [miss, setMiss] = useState(false);
  const [dup, setDup] = useState(false);
  const [, setBindOpen] = useCanvasState("mine-bind-open", false);
  return (
    <Stack gap={8}>
      <Field label="平台">
        <Select
          value={props.ctx.bindPlatform}
          onChange={props.ctx.setBindPlatform}
          options={[{ value: "微信支付", label: "微信支付" }, { value: "支付宝", label: "支付宝" }]}
        />
      </Field>
      <Field label="平台用户 ID" hint="去掉首尾空格后精确匹配，区分大小写。">
        <TextInput value={props.ctx.bindPid} onChange={props.ctx.setBindPid} />
      </Field>
      {miss ? <Callout tone="warning">未找到对应捐款记录。</Callout> : null}
      {dup ? <Callout tone="info">已经绑定。</Callout> : null}
      <Row gap={8} justify="end">
        <Button
          variant="primary"
          onClick={() => {
            const pid = props.ctx.bindPid.trim();
            const live = keptGifts(props.ctx.goneGifts).filter((g) => g.platform === props.ctx.bindPlatform && g.pid === pid);
            const owned = props.ctx.persona === "member" && props.ctx.bindPlatform === "支付宝" && pid === "2088xxxx" && !props.ctx.releasedAlipay;
            const ownedWx = props.ctx.persona === "member" && props.ctx.alsoWechat && props.ctx.bindPlatform === "微信支付" && pid === "oAbc123";
            setDup(owned || ownedWx);
            setMiss(!(owned || ownedWx) && live.length === 0);
            if (owned || ownedWx || live.length === 0) return;
            if (props.ctx.bindPlatform === "微信支付" && pid === "oAbc123") props.ctx.setAlsoWechat(true);
            if (props.ctx.bindPlatform === "支付宝" && pid === "2088xxxx") props.ctx.setReleasedAlipay(false);
            if (props.ctx.persona === "guest") props.ctx.setPersona("member");
            setBindOpen(false);
            props.ctx.open("u-mine", "已绑定。该身份出现在捐赠身份中。");
          }}
        >
          提交绑定
        </Button>
      </Row>
    </Stack>
  );
}

function UserEdit(props: { ctx: Ctx }) {
  const seed = giftById(props.ctx.donationId);
  const [anon, setAnon] = useState(seed.anon);
  const [name, setName] = useState(seed.display);
  const [bio, setBio] = useState(seed.bio);
  const [error, setError] = useState("");
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("u-mine")}>返回</Button>
      <Text weight="semibold">修改对外资料</Text>
      <Text size="small" tone="secondary">{seed.platform} · {seed.pid} 不能修改</Text>
      <Row justify="space-between" align="center">
        <Text size="small">匿名</Text>
        <Toggle checked={anon} onChange={setAnon} />
      </Row>
      <Field label="对外展示名" hint="未匿名且为空时，公开页面显示「{平台}捐款人」。">
        <TextInput value={name} onChange={setName} />
      </Field>
      <Field label="个人说明" hint="不超过 200 字。善款列表不展示。">
        <TextArea value={bio} onChange={setBio} rows={3} />
      </Field>
      <Field label="手机号" hint="不能修改。批量导入有手机号时会更新，留空不改变。">
        <Text size="small">{seed.mask || "未填写"}</Text>
      </Field>
      {error ? <Callout tone="warning">{error}</Callout> : null}
      <Row justify="end">
        <Button
          variant="primary"
          onClick={() => {
            if (bio.length > 200) {
              setError("个人说明超出 200 字，未保存。");
              return;
            }
            props.ctx.open("u-mine", "已保存。身份标记为「用户已修改」。管理人员仍可更正这三项，更正后标记改回未修改。标记为已修改期间，导入不再覆盖这三项。手机号仍随批量导入更新。");
          }}
        >
          保存
        </Button>
      </Row>
    </Stack>
  );
}

function UnclaimDialog(props: { ctx: Ctx }) {
  const theme = useHostTheme();
  const label = props.ctx.pendingUnclaim === "wx" ? "微信支付 · 匿名捐款人" : "支付宝 · 张先生";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: theme.fill.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          background: theme.bg.elevated,
          border: `1px solid ${theme.stroke.primary}`,
          borderRadius: theme.radius.lg,
          padding: 16,
        }}
      >
        <Stack gap={8}>
          <Text weight="semibold">解除绑定</Text>
          <Text size="small">确认解除「{label}」？只影响当前手机号。身份、其他认领、善款及其项目都还在。</Text>
          <Row gap={8} justify="end">
            <Button variant="ghost" onClick={() => props.ctx.setPendingUnclaim("")}>取消</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (props.ctx.pendingUnclaim === "ali") props.ctx.setReleasedAlipay(true);
                if (props.ctx.pendingUnclaim === "wx") props.ctx.setAlsoWechat(false);
                props.ctx.setPendingUnclaim("");
              }}
            >
              确认解除
            </Button>
          </Row>
        </Stack>
      </div>
    </div>
  );
}

function GiftDesktopTable(props: { rows: Gift[]; ctx: Ctx }) {
  const theme = useHostTheme();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const cell = {
    padding: "8px 6px",
    borderBottom: `1px solid ${theme.stroke.tertiary}`,
    textAlign: "left" as const,
    verticalAlign: "middle" as const,
    whiteSpace: "nowrap" as const,
    wordBreak: "normal" as const,
    overflowWrap: "normal" as const,
    fontSize: 13,
    color: theme.text.primary,
  };
  const headers = ["善款编号", "金额", "捐款身份姓名", "日期", "项目", ""];
  const widths = ["16%", "12%", "18%", "14%", "16%", "24%"];
  return (
    <table style={{ width: "100%", maxWidth: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
      <colgroup>
        {widths.map((width, index) => <col key={headers[index] || "ops"} style={{ width }} />)}
      </colgroup>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header || "ops"} style={{ ...cell, color: theme.text.tertiary, fontWeight: 600, fontSize: 12, textAlign: header ? "left" : "right" }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.flatMap((gift) => {
          const shown = Boolean(open[gift.id]);
          const projectId = giftProjectId(gift.projectId, gone);
          const project = projectId ? (projectById(projectId)?.name ?? "—") : "—";
          const main = (
            <tr key={gift.id}>
              <td style={cell}>{gift.no}</td>
              <td style={cell}>{yuan(gift.amount)}</td>
              <td style={cell}>{publicName(gift)}</td>
              <td style={cell}>{gift.date}</td>
              <td style={cell}>{project}</td>
              <td style={{ ...cell, textAlign: "right" }}>
                <Row gap={6} justify="end" style={{ flexWrap: "nowrap" }}>
                  <Button variant="ghost" style={{ whiteSpace: "nowrap", flex: "0 0 auto", width: "auto" }} onClick={() => setOpen((prev) => ({ ...prev, [gift.id]: !prev[gift.id] }))}>{shown ? "收起" : "展开"}</Button>
                  <Button variant="ghost" style={{ whiteSpace: "nowrap", flex: "0 0 auto", width: "auto" }} onClick={() => props.ctx.showIdentity(identityIdOf(gift))}>打开身份</Button>
                  <Button variant="secondary" style={{ whiteSpace: "nowrap", flex: "0 0 auto", width: "auto" }} onClick={() => props.ctx.openGift(gift.id, "a-void")}>作废</Button>
                </Row>
              </td>
            </tr>
          );
          if (!shown) return [main];
          return [main, (
            <tr key={`${gift.id}-more`}>
              <td colSpan={6} style={cell}>
                <Text size="small" tone="secondary">捐款平台 {gift.platform} · 订单编号 {gift.order} · 备注 {gift.remark || "无"}</Text>
              </td>
            </tr>
          )];
        })}
      </tbody>
    </table>
  );
}

function GiftMobileCard(props: { gift: Gift; ctx: Ctx }) {
  const [open, setOpen] = useState(false);
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const gift = props.gift;
  const projectId = giftProjectId(gift.projectId, gone);
  const project = projectId ? (projectById(projectId)?.name ?? "—") : "—";
  return (
    <RecordCard
      name={`${yuan(gift.amount)} ${publicName(gift)}`}
      date={gift.date}
      action={
        <>
          <Button variant="ghost" onClick={() => setOpen((value) => !value)}>{open ? "收起" : "展开"}</Button>
          <Button variant="ghost" onClick={() => props.ctx.showIdentity(identityIdOf(gift))}>打开身份</Button>
          <Button variant="secondary" onClick={() => props.ctx.openGift(gift.id, "a-void")}>作废</Button>
        </>
      }
    >
      <Text size="small" tone="secondary" style={{ overflowWrap: "anywhere" }}>{gift.no}</Text>
      <Text size="small" tone="secondary">{project === "—" ? "尚未安排" : project}</Text>
      {open ? (
        <>
          <Text size="small" tone="secondary">{gift.platform} {gift.order}</Text>
          <Text size="small" tone="secondary">{gift.remark || "无"}</Text>
        </>
      ) : null}
    </RecordCard>
  );
}

function AdminGifts(props: { ctx: Ctx }) {
  const fields: QueryField[] = [
    { id: "order", label: "订单编号", kind: "key", placeholder: "订单编号" },
    { id: "pid", label: "捐款身份平台 ID", kind: "key", placeholder: "捐款身份平台 ID" },
    { id: "who", label: "捐款身份姓名/手机号", kind: "name", placeholder: "姓名或手机号" },
    { id: "arrange", label: "项目", kind: "category", options: ["全部", "已安排", "尚未安排"] },
    { id: "from", label: "捐款日期起", kind: "time", placeholder: "YYYY-MM-DD" },
    { id: "to", label: "捐款日期止", kind: "time", placeholder: "YYYY-MM-DD" },
  ];
  const [query, setQuery] = useState<Record<string, string>>(() => blankQuery(fields));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const arrange = query.arrange ?? "全部";
  const order = queryText(query, "order");
  const pid = queryText(query, "pid");
  const who = queryText(query, "who");
  const list = keptGifts(props.ctx.goneGifts).filter((gift) => {
    const projectId = giftProjectId(gift.projectId, gone);
    if (arrange === "已安排" && !projectId) return false;
    if (arrange === "尚未安排" && projectId) return false;
    if (order && !hasText(gift.order, order)) return false;
    if (pid && !hasText(gift.pid, pid)) return false;
    if (who && !containsQuery(who, [publicName(gift), gift.display, gift.phone, gift.mask])) return false;
    return inDates(gift.date, queryText(query, "from"), queryText(query, "to"));
  }).slice().sort((a, b) => b.date.localeCompare(a.date));
  const rows = takePage(list, page, !props.ctx.adminWide, pageSize);
  return (
    <Stack gap={10}>
      <Notice text={props.ctx.notice} />
      <Row justify="end" gap={8} wrap>
        <Button variant="secondary" onClick={() => props.ctx.open("a-void-batch")}>批量作废</Button>
        <Button variant="secondary" onClick={() => props.ctx.open("a-import")}>批量导入</Button>
        <Button variant="primary" onClick={() => props.ctx.open("a-entry")}>新建善款</Button>
      </Row>
      <QueryForm
        wide={props.ctx.adminWide}
        showFold
        fields={fields}
        onApply={(next) => { setQuery(next); setPage(1); }}
      />
      {list.length === 0 ? <Text tone="secondary">没有符合条件的善款。</Text> : null}
      {props.ctx.adminWide ? (
        <GiftDesktopTable rows={rows} ctx={props.ctx} />
      ) : rows.map((gift) => (
        <GiftMobileCard key={gift.id} gift={gift} ctx={props.ctx} />
      ))}
      <Pager page={page} total={list.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite={!props.ctx.adminWide} />
    </Stack>
  );
}

function VoidedDesktopTable(props: { rows: { gift: Gift; at: string; reason: string }[]; ctx: Ctx }) {
  const theme = useHostTheme();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const cell = {
    padding: "8px 6px",
    borderBottom: `1px solid ${theme.stroke.tertiary}`,
    textAlign: "left" as const,
    verticalAlign: "middle" as const,
    whiteSpace: "normal" as const,
    overflowWrap: "anywhere" as const,
    wordBreak: "break-word" as const,
    fontSize: 13,
    color: theme.text.primary,
  };
  const headers = ["善款编号", "金额", "捐款身份姓名", "日期", "作废时间", ""];
  const widths = ["16%", "12%", "20%", "14%", "18%", "20%"];
  return (
    <table style={{ width: "100%", maxWidth: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
      <colgroup>
        {widths.map((width, index) => <col key={headers[index] || "ops"} style={{ width }} />)}
      </colgroup>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header || "ops"} style={{ ...cell, color: theme.text.tertiary, fontWeight: 600, fontSize: 12, textAlign: header ? "left" : "right" }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.flatMap((row) => {
          const gift = row.gift;
          const shown = Boolean(open[gift.id]);
          const remark = voidedRemark(gift.remark, row.reason);
          const main = (
            <tr key={gift.id}>
              <td style={cell}>{gift.no}</td>
              <td style={cell}>{yuan(gift.amount)}</td>
              <td style={cell}>{publicName(gift)}</td>
              <td style={cell}>{gift.date}</td>
              <td style={cell}>{row.at}</td>
              <td style={{ ...cell, textAlign: "right" }}>
                <Row gap={6} justify="end" wrap>
                  <Button variant="ghost" onClick={() => setOpen((prev) => ({ ...prev, [gift.id]: !prev[gift.id] }))}>{shown ? "收起" : "展开"}</Button>
                  <Button variant="ghost" onClick={() => props.ctx.showIdentity(identityIdOf(gift))}>打开身份</Button>
                </Row>
              </td>
            </tr>
          );
          if (!shown) return [main];
          return [main, (
            <tr key={`${gift.id}-more`}>
              <td colSpan={6} style={cell}>
                <Text size="small" tone="secondary">捐款平台 {gift.platform} · 订单编号 {gift.order} · 备注 {remark}</Text>
              </td>
            </tr>
          )];
        })}
      </tbody>
    </table>
  );
}

function VoidedMobileCard(props: { gift: Gift; at: string; reason: string; ctx: Ctx }) {
  const [open, setOpen] = useState(false);
  const gift = props.gift;
  const remark = voidedRemark(gift.remark, props.reason);
  return (
    <RecordCard
      name={`${yuan(gift.amount)} ${publicName(gift)}`}
      date={gift.date}
      action={
        <>
          <Button variant="ghost" onClick={() => setOpen((value) => !value)}>{open ? "收起" : "展开"}</Button>
          <Button variant="ghost" onClick={() => props.ctx.showIdentity(identityIdOf(gift))}>打开身份</Button>
        </>
      }
    >
      <Text size="small" tone="secondary" style={{ overflowWrap: "anywhere" }}>{gift.no}</Text>
      <Text size="small" tone="secondary">作废时间 {props.at}</Text>
      {open ? (
        <>
          <Text size="small" tone="secondary">{gift.platform} {gift.order}</Text>
          <Text size="small" tone="secondary" style={{ overflowWrap: "anywhere" }}>{remark}</Text>
        </>
      ) : null}
    </RecordCard>
  );
}

function AdminVoided(props: { ctx: Ctx }) {
  const fields: QueryField[] = [
    { id: "order", label: "订单编号", kind: "key", placeholder: "订单编号" },
    { id: "pid", label: "捐款身份平台 ID", kind: "key", placeholder: "捐款身份平台 ID" },
    { id: "who", label: "捐款身份姓名/手机号", kind: "name", placeholder: "姓名或手机号" },
    { id: "from", label: "捐款日期起", kind: "time", placeholder: "YYYY-MM-DD" },
    { id: "to", label: "捐款日期止", kind: "time", placeholder: "YYYY-MM-DD" },
    { id: "voidFrom", label: "作废日期起", kind: "time", placeholder: "YYYY-MM-DD" },
    { id: "voidTo", label: "作废日期止", kind: "time", placeholder: "YYYY-MM-DD" },
  ];
  const [query, setQuery] = useState<Record<string, string>>(() => blankQuery(fields));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("voided-page-size", 10);
  const order = queryText(query, "order");
  const pid = queryText(query, "pid");
  const who = queryText(query, "who");
  const list = props.ctx.voided.flatMap((mark) => {
    const gift = GIFTS.find((item) => item.id === mark.id);
    if (!gift) return [];
    if (order && !hasText(gift.order, order)) return [];
    if (pid && !hasText(gift.pid, pid)) return [];
    if (who && !containsQuery(who, [publicName(gift), gift.display, gift.phone, gift.mask])) return [];
    if (!inDates(gift.date, queryText(query, "from"), queryText(query, "to"))) return [];
    if (!inDates(mark.at.slice(0, 10), queryText(query, "voidFrom"), queryText(query, "voidTo"))) return [];
    return [{ gift, at: mark.at, reason: mark.reason }];
  }).sort((a, b) => b.at.localeCompare(a.at));
  const rows = takePage(list, page, !props.ctx.adminWide, pageSize);
  return (
    <Stack gap={10}>
      <Notice text={props.ctx.notice} />
      <QueryForm
        wide={props.ctx.adminWide}
        showFold
        fields={fields}
        onApply={(next) => { setQuery(next); setPage(1); }}
      />
      {list.length === 0 ? <Text tone="secondary">没有符合条件的作废善款。</Text> : null}
      {props.ctx.adminWide ? (
        <VoidedDesktopTable rows={rows} ctx={props.ctx} />
      ) : rows.map((row) => (
        <VoidedMobileCard key={row.gift.id} gift={row.gift} at={row.at} reason={row.reason} ctx={props.ctx} />
      ))}
      <Pager page={page} total={list.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite={!props.ctx.adminWide} />
    </Stack>
  );
}

function containsQuery(query: string, fields: string[]): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return false;
  return fields.some((field) => field.toLowerCase().includes(needle));
}

function PersonStepPager(props: { page: number; total: number; pageSize: number; onPage: (page: number) => void }) {
  const theme = useHostTheme();
  const pages = Math.max(1, Math.ceil(props.total / props.pageSize));
  const page = Math.min(Math.max(1, props.page), pages);
  const go = (next: number) => {
    if (next < 1 || next > pages || next === page) return;
    props.onPage(next);
  };
  const step = (label: string, target: number, enabled: boolean) => (
    <button
      type="button"
      onClick={() => go(target)}
      disabled={!enabled}
      style={{
        margin: 0,
        border: "none",
        background: "transparent",
        color: enabled ? theme.text.secondary : theme.text.tertiary,
        cursor: enabled ? "pointer" : "default",
        font: "inherit",
        fontSize: 13,
        padding: "4px 0",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
  return (
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "center", width: "100%", gap: 8 }}>
      <span style={{ marginRight: "auto", whiteSpace: "nowrap", fontSize: 13, color: theme.text.secondary }}>共 {props.total} 条 · 第 {page} / {pages} 页</span>
      {step("上一页", page - 1, page > 1)}
      {step("下一页", page + 1, page < pages)}
    </div>
  );
}

function PersonQuery(props: {
  ctx: Ctx;
  picked: string[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  lockedId?: string;
  excludeIds?: string[];
  allowCreate?: boolean;
  foldAdd?: boolean;
  recent?: boolean;
}) {
  const theme = useHostTheme();
  const fields: QueryField[] = [
    { id: "id", label: "唯一 ID", kind: "key", placeholder: "唯一 ID" },
    { id: "name", label: "姓名", kind: "name", placeholder: "姓名" },
  ];
  const [query, setQuery] = useState<Record<string, string> | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const [addOpen, setAddOpen] = useState(false);
  const exclude = new Set(props.excludeIds ?? []);
  const pickedPeople = PEOPLE.filter((person) => props.picked.includes(person.id));
  const name = queryText(query ?? {}, "name");
  const idNo = queryText(query ?? {}, "id");
  const active = Boolean(name || idNo);
  const browsing = Boolean(props.recent) && !active;
  const matched = query && active
    ? PEOPLE.filter((person) => hasText(person.name, name) && (!idNo || containsQuery(idNo, [person.idNo, person.mask])))
    : [];
  const byUpdated = (list: Person[]) => list.slice().sort((a, b) => b.updated.localeCompare(a.updated));
  const pool = PEOPLE.filter((person) => !props.picked.includes(person.id) && !exclude.has(person.id));
  const hits = active
    ? byUpdated(matched.filter((person) => !props.picked.includes(person.id) && !exclude.has(person.id)))
    : browsing
      ? byUpdated(pool)
      : [];
  const blocked = matched.filter((person) => props.picked.includes(person.id) || exclude.has(person.id));
  const showQuery = !props.foldAdd || addOpen;
  const mobileSize = 5;
  const mobilePages = Math.max(1, Math.ceil(hits.length / mobileSize));
  const mobilePage = Math.min(Math.max(1, page), mobilePages);
  const mobileHits = hits.slice((mobilePage - 1) * mobileSize, mobilePage * mobileSize);
  return (
    <Stack gap={8}>
      <Text size="small" weight="semibold">受益人</Text>
      {props.foldAdd ? null : (
        <Text size="small" tone="secondary">
          {props.recent ? "尚未加入本项目的档案按更新时间倒序分页。桌面每页 10 条，移动每页 5 条。也可按姓名或唯一 ID 查询。" : "按姓名或唯一 ID 查询后添加。打开页面时不列出全部档案。"}
        </Text>
      )}
      {props.ctx.adminWide && props.foldAdd && pickedPeople.length > 0 ? (
        <Table
          headers={["姓名", "唯一 ID", "备注", ""]}
          columnAlign={["left", "left", "left", "right"]}
          rows={pickedPeople.map((person) => {
            const locked = props.lockedId === person.id;
            return [
              person.name,
              person.mask,
              person.note || "无",
              locked ? <Text key={`${person.id}-lock`} size="small" tone="secondary">本次不能移除</Text> : <Button key={`${person.id}-rm`} variant="ghost" onClick={() => props.onRemove(person.id)}>移除</Button>,
            ];
          })}
          striped
        />
      ) : null}
      {props.ctx.adminWide && props.foldAdd ? null : pickedPeople.map((person, index) => {
        const locked = props.lockedId === person.id;
        const lastBeforeAdd = props.foldAdd && index === pickedPeople.length - 1;
        if (!props.ctx.adminWide) {
          return (
            <div key={person.id} style={{ padding: "8px 0", borderBottom: lastBeforeAdd ? "none" : `1px solid ${theme.stroke.tertiary}` }}>
              <Row justify="space-between" align="center" gap={8} style={{ flexWrap: "nowrap" }}>
                <Row gap={8} align="center" style={{ flexWrap: "nowrap", flex: 1, minWidth: 0 }}>
                  <Text as="span" weight="semibold" style={{ whiteSpace: "nowrap", flex: "0 0 auto" }}>{person.name}</Text>
                  <Text as="span" size="small" tone="secondary" style={{ whiteSpace: "nowrap" }}>{person.mask}</Text>
                </Row>
                {locked ? null : <Button variant="ghost" onClick={() => props.onRemove(person.id)}>移除</Button>}
              </Row>
              <Text size="small" tone="secondary">{person.note || "无"}</Text>
              {locked ? <Text size="small" tone="secondary">本次不能移除</Text> : null}
            </div>
          );
        }
        return (
          <RecordCard
            key={person.id}
            name={person.name}
            line={lastBeforeAdd ? false : undefined}
            action={locked ? undefined : <Button variant="ghost" onClick={() => props.onRemove(person.id)}>移除</Button>}
          >
            <Text size="small" tone="secondary">{person.mask}{locked ? " · 本次不能移除" : ""}</Text>
            <Text size="small" tone="secondary">{person.note || "无"}</Text>
          </RecordCard>
        );
      })}
      {props.foldAdd ? (
        <button
          type="button"
          onClick={() => setAddOpen((open) => !open)}
          style={{
            display: "block",
            width: "100%",
            margin: 0,
            padding: "4px 0",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            textAlign: "center",
            color: theme.text.link,
            font: "inherit",
            fontSize: 13,
          }}
        >
          {addOpen ? "收起添加受益人" : "添加受益人"}
        </button>
      ) : null}
      {showQuery ? (
        <Stack gap={8}>
          {props.foldAdd ? (
            <Text size="small" tone="secondary">
              {props.recent ? "尚未加入本项目的档案按更新时间倒序分页。桌面每页 10 条，移动每页 5 条。也可按姓名或唯一 ID 查询。" : "按姓名或唯一 ID 查询后添加。打开时不列出全部档案。"}
            </Text>
          ) : null}
          <QueryForm
            wide={props.ctx.adminWide}
            fields={fields}
            onApply={(next) => {
              setQuery(next);
              setPage(1);
            }}
          />
          {query && !active && !props.recent ? <Text size="small" tone="secondary">请输入姓名或唯一 ID 后再查询。</Text> : null}
          {active && hits.length === 0 && blocked.length === 0 ? <Text size="small" tone="secondary">没有匹配的受益人。</Text> : null}
          {active && hits.length === 0 && blocked.length > 0 ? (
            <Text size="small" tone="secondary">
              {blocked.every((person) => props.picked.includes(person.id)) ? "匹配的受益人已经添加。" : "匹配的受益人已在本项目中。"}
            </Text>
          ) : null}
          {hits.length > 0 && props.ctx.adminWide ? (
            <Table
              headers={["姓名", "唯一 ID", "备注", ""]}
              columnAlign={["left", "left", "left", "right"]}
              rows={takePage(hits, page, false, pageSize).map((person) => [
                person.name,
                person.mask,
                person.note || "无",
                <Button key={`${person.id}-add`} variant="primary" onClick={() => props.onAdd(person.id)}>添加</Button>,
              ])}
              striped
            />
          ) : null}
          {!props.ctx.adminWide ? mobileHits.map((person) => (
            <div key={person.id} style={{ padding: "8px 0", borderBottom: props.foldAdd ? "none" : `1px solid ${theme.stroke.tertiary}` }}>
              <Row justify="space-between" align="center" gap={8} style={{ flexWrap: "nowrap" }}>
                <Row gap={8} align="center" style={{ flexWrap: "nowrap", flex: 1, minWidth: 0 }}>
                  <Text as="span" weight="semibold" style={{ whiteSpace: "nowrap", flex: "0 0 auto" }}>{person.name}</Text>
                  <Text as="span" size="small" tone="secondary" style={{ whiteSpace: "nowrap" }}>{person.mask}</Text>
                </Row>
                <Button variant="primary" onClick={() => props.onAdd(person.id)}>添加</Button>
              </Row>
              <Text size="small" tone="secondary">{person.note || "无"}</Text>
            </div>
          )) : null}
          {hits.length > 0 && (active || browsing) ? (
            props.ctx.adminWide
              ? <Pager page={page} total={hits.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} />
              : <PersonStepPager page={page} total={hits.length} pageSize={5} onPage={setPage} />
          ) : null}
          {props.allowCreate && (PEOPLE.length === 0 || (active && hits.length === 0)) ? (
            <Row justify="end">
              <Button variant="secondary" onClick={() => props.ctx.open("a-person-new")}>前往新建受益人</Button>
            </Row>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
}

function IdentityHitTable(props: { rows: Identity[]; onAdd: (id: string) => void }) {
  const theme = useHostTheme();
  const cell = {
    padding: "8px 6px",
    borderBottom: `1px solid ${theme.stroke.tertiary}`,
    textAlign: "left" as const,
    verticalAlign: "middle" as const,
    whiteSpace: "nowrap" as const,
    wordBreak: "normal" as const,
    overflowWrap: "normal" as const,
    fontSize: 13,
    color: theme.text.primary,
  };
  const headers = ["平台", "平台用户 ID", "展示", "手机号", ""];
  return (
    <table style={{ width: "100%", maxWidth: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header || "ops"} style={{ ...cell, color: theme.text.tertiary, fontWeight: 600, fontSize: 12, textAlign: header ? "left" : "right" }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((item) => (
          <tr key={item.id}>
            <td style={cell}>{item.platform}</td>
            <td style={cell}>{item.pid}</td>
            <td style={cell}>{identityLabel(item)}</td>
            <td style={cell}>{item.phone || "未填写"}</td>
            <td style={{ ...cell, textAlign: "right" }}>
              <Row justify="end" style={{ flexWrap: "nowrap" }}>
                <Button variant="primary" style={{ whiteSpace: "nowrap", flex: "0 0 auto", width: "auto" }} onClick={() => props.onAdd(item.id)}>添加</Button>
              </Row>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AdminEntry(props: { ctx: Ctx }) {
  const options = allIdentities();
  const fields: QueryField[] = [
    { id: "pid", label: "平台用户 ID", kind: "key", placeholder: "平台用户 ID" },
    { id: "name", label: "对外展示名", kind: "name", placeholder: "对外展示名" },
    { id: "phone", label: "手机号", kind: "key", placeholder: "手机号" },
  ];
  const [query, setQuery] = useState<Record<string, string> | null>(null);
  const [hitPage, setHitPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const [identityId, setIdentityId] = useState("");
  const [amount, setAmount] = useState("100");
  const [date, setDate] = useState("2026-10-19");
  const [order, setOrder] = useState("4200001100202610190001");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const picked = options.find((item) => item.id === identityId);
  const pid = queryText(query ?? {}, "pid");
  const display = queryText(query ?? {}, "name");
  const phone = queryText(query ?? {}, "phone");
  const active = Boolean(pid || display || phone);
  const hits = query && active ? options.filter((item) => {
    if (pid && !hasText(item.pid, pid)) return false;
    if (display && !containsQuery(display, [item.display, identityLabel(item)])) return false;
    if (phone && !containsQuery(phone, [item.phone, item.mask])) return false;
    return true;
  }) : [];
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("a-gifts")}>返回</Button>
      <Text size="small" tone="secondary">按平台用户 ID、手机号或展示名查询后添加一条已有身份。本页不列出全部身份，也不修改身份资料。没有身份时，先去创建。</Text>
      {picked ? (
        props.ctx.adminWide ? (
          <Row justify="space-between" align="center" style={{ flexWrap: "nowrap" }}>
            <Text as="span" size="small" style={{ whiteSpace: "nowrap" }}>{picked.platform} · {picked.pid} · {identityLabel(picked)} · {picked.phone || "未填写手机号"}</Text>
            <Button variant="ghost" style={{ whiteSpace: "nowrap", flex: "0 0 auto", width: "auto" }} onClick={() => setIdentityId("")}>移除</Button>
          </Row>
        ) : (
          <Stack gap={8}>
            <AdminLine action={<Button variant="ghost" onClick={() => setIdentityId("")}>移除</Button>}>
              <Text size="small" weight="semibold">{picked.platform} · {picked.pid}</Text>
              <Text size="small" tone="secondary">{identityLabel(picked)} · {picked.mask || "未填写手机号"}</Text>
            </AdminLine>
            <Callout tone="info" title="所选身份（只读）">
              {`${picked.anon ? "匿名" : "不匿名"} · 展示名 ${picked.display || "空"} · 个人说明 ${picked.bio || "空"} · 手机号 ${picked.mask || "未填写"}。保存只新增善款。`}
            </Callout>
          </Stack>
        )
      ) : (
        <Stack gap={8}>
          <QueryForm wide={props.ctx.adminWide} fields={fields} onApply={(next) => { setQuery(next); setHitPage(1); }} />
          {query && !active ? <Text size="small" tone="secondary">请输入查询条件后再查询。</Text> : null}
          {active && hits.length === 0 ? <Text size="small" tone="secondary">没有匹配的捐款身份。</Text> : null}
          {hits.length > 0 && props.ctx.adminWide ? (
            <IdentityHitTable rows={takePage(hits, hitPage, false, pageSize)} onAdd={setIdentityId} />
          ) : null}
          {!props.ctx.adminWide ? takePage(hits, hitPage, true, pageSize).map((item) => (
            <RecordCard
              key={item.id}
              name={identityLabel(item)}
              status={item.anon ? "匿名" : "不匿名"}
              action={<Button variant="primary" onClick={() => setIdentityId(item.id)}>添加</Button>}
            >
              <Text size="small" tone="secondary">{item.platform} · {item.pid}</Text>
              <Text size="small" tone="secondary">{item.mask || "未填写手机号"}</Text>
            </RecordCard>
          )) : null}
          {active ? <Pager page={hitPage} total={hits.length} onPage={setHitPage} pageSize={pageSize} onPageSize={setPageSize} infinite={!props.ctx.adminWide} /> : null}
        </Stack>
      )}
      {props.ctx.adminWide ? null : <Divider />}
      {props.ctx.adminWide ? (
        <Stack gap={10}>
          <Field label="订单编号" hint="必填，最长 64 个字符，全库唯一。创建后不能改。批量作废按它查找。">
            <TextInput value={order} onChange={setOrder} />
          </Field>
          <Grid columns={2} gap={10}>
            <Field label="金额">
              <TextInput value={amount} onChange={setAmount} />
            </Field>
            <Field label="捐款日期" hint="不得晚于 2026-10-19。">
              <TextInput value={date} onChange={setDate} />
            </Field>
          </Grid>
          <Field label="备注" hint="仅管理人员可见。">
            <TextInput value={remark} onChange={setRemark} />
          </Field>
        </Stack>
      ) : (
        <Stack gap={10}>
          <Field label="订单编号" hint="必填，最长 64 个字符，全库唯一。创建后不能改。批量作废按它查找。">
            <TextInput value={order} onChange={setOrder} />
          </Field>
          <Field label="金额">
            <TextInput value={amount} onChange={setAmount} />
          </Field>
          <Field label="捐款日期" hint="不得晚于 2026-10-19。">
            <TextInput value={date} onChange={setDate} />
          </Field>
          <Field label="备注" hint="仅管理人员可见。">
            <TextInput value={remark} onChange={setRemark} />
          </Field>
        </Stack>
      )}
      {error ? <Callout tone="warning">{error}</Callout> : null}
      <Row gap={8} justify="end">
        <Button variant="secondary" onClick={() => props.ctx.open("a-identity-new")}>去创建捐款身份</Button>
        <Button
          variant="primary"
          onClick={() => {
            if (!picked) {
              setError("请先选择已有捐款身份。未保存。");
              return;
            }
            const value = order.trim();
            if (!value || value.length > 64) {
              setError("订单编号必填，且不超过 64 个字符。未保存。");
              return;
            }
            if (GIFTS.some((g) => g.order === value)) {
              setError("订单编号与已有善款重复。未保存。");
              return;
            }
            props.ctx.open("a-gifts", `已挂在「${picked.platform} · ${picked.pid}」下，身份资料未改。新善款尚未安排到项目。`);
          }}
        >
          保存
        </Button>
      </Row>
    </Stack>
  );
}

function AdminImport(props: { ctx: Ctx }) {
  const [step, setStep] = useState<"file" | "preview" | "done">("file");
  const [bad, setBad] = useState(false);
  const [note, setNote] = useState("");
  const [, setImportFiles] = useCanvasState<BatchFile[]>("import-files", IMPORT_FILE_SEED);
  if (step === "file") {
    return (
      <Stack gap={8}>
        <Button variant="ghost" onClick={() => props.ctx.open("a-gifts")}>返回</Button>
        <Text size="small" tone="secondary">上传 Excel（.xlsx），单次最多 500 行。只读第一个工作表，第一行是表头。平台用户 ID、手机号、订单编号按文本填写。文件不含是否匿名、个人说明、备注。整批成功后，原文件存入「导入文档」的导入目录。</Text>
        {props.ctx.adminWide ? (
          <Table
            headers={["平台", "平台用户 ID", "对外展示名", "手机号", "金额", "捐款日期", "订单编号"]}
            rows={[
              ["微信支付", "oAbc123", "张三", "13800000000", "200", "2026-10-01", "4200001100202610010091"],
              ["支付宝", "2088xxxx", "", "13900000000", "500.50", "2026-10-02", "2026100222001400000092"],
            ]}
            striped
          />
        ) : (
          <Text size="small" tone="secondary">示例：微信支付，平台用户 ID oAbc123，展示名张三，手机号 13800000000，金额 200，日期 2026-10-01，订单编号 4200001100202610010091。</Text>
        )}
        {note ? <Text size="small">{note}</Text> : null}
        <Row gap={8} justify="end">
          <Button variant="secondary" onClick={() => setNote("已开始下载「善款导入模板.xlsx」。")}>下载模板</Button>
          <Button variant="primary" onClick={() => setStep("preview")}>上传文件并预览</Button>
        </Row>
      </Stack>
    );
  }
  if (step === "done") {
    return (
      <Stack gap={8}>
        <Callout tone="success" title="本批已写入">2 行全部通过，新增 2 笔尚未安排到项目的善款。原 Excel 已存入导入目录。任一行失败时不会到达此页，也不保存文件。</Callout>
        <Text size="small">写入了手机号的身份：该号码已有登录的，会立即出现在对应用户的捐赠身份里；还没登录过的，下次登录再认领。旧认领保留。</Text>
        <Row gap={8} justify="end">
          <Button variant="ghost" onClick={() => setStep("file")}>再导入一批</Button>
          <Button variant="secondary" onClick={() => props.ctx.open("a-files")}>查看导入文档</Button>
          <Button variant="primary" onClick={() => props.ctx.open("a-gifts")}>前往善款列表</Button>
        </Row>
      </Stack>
    );
  }
  return (
    <Stack gap={8}>
      <Text weight="semibold">导入预览</Text>
      <Checkbox checked={bad} onChange={setBad} label="加入一行错误，查看整批不写入" />
      {props.ctx.adminWide ? (
        <Table
          headers={["行", "身份处理", "结果"]}
          rows={[
            ["2", "微信支付 oAbc123 已存在，用户未修改", "展示名将更新为「张三」。手机号将写入。匿名和个人说明不改。新增一笔尚未安排到项目的善款。"],
            ["3", "支付宝 2088xxxx 已存在，用户已修改", "展示名本次不覆盖。手机号将写入。匿名和个人说明不改。只新增一笔善款。"],
            ...(bad ? [["4", "平台用户 ID 为空，手机号 123，金额 -1，日期晚于今天", "第 4 行失败"]] as string[][] : []),
          ]}
          rowTone={bad ? [undefined, undefined, "danger"] : undefined}
          striped
        />
      ) : [
        ["2", "微信支付 oAbc123 已存在，用户未修改", "展示名将更新为「张三」。手机号将写入。匿名和个人说明不改。新增一笔尚未安排到项目的善款。"],
        ["3", "支付宝 2088xxxx 已存在，用户已修改", "展示名本次不覆盖。手机号将写入。匿名和个人说明不改。只新增一笔善款。"],
        ...(bad ? [["4", "平台用户 ID 为空，手机号 123，金额 -1，日期晚于今天", "第 4 行失败"]] : []),
      ].map((row) => (
        <AdminLine key={row[0]}>
          <Text size="small" weight="semibold">第 {row[0]} 行</Text>
          <Text size="small">{row[1]}</Text>
          <Text size="small" tone="secondary">{row[2]}</Text>
        </AdminLine>
      ))}
      <Text size="small" tone="secondary">同一身份多行时，每行各生成一笔善款，并写入该行订单编号。用户未修改时，展示名以最后一行为准。手机号不论用户是否已修改，都以最后一条非空值为准。订单编号为空、超过 64 字、本批重复或与已有善款重复时，该行失败，整批不写入。</Text>
      {bad ? <Callout tone="danger" title="第 4 行">平台用户 ID 为空；手机号不是 11 位；金额须大于 0；日期不得晚于今天。确认写入不可用，整批不写入。</Callout> : null}
      <Row gap={8} justify="end">
        <Button variant="ghost" onClick={() => setStep("file")}>返回修改文件</Button>
        <Button variant="primary" disabled={bad} onClick={() => {
          setImportFiles((prev) => [{ id: `imp-${prev.length + 1}`, name: "善款导入-20261019.xlsx", at: "2026-10-19 10:27", rows: 2 }, ...prev]);
          setStep("done");
        }}>确认写入</Button>
      </Row>
    </Stack>
  );
}

function AdminCorrect(props: { ctx: Ctx }) {
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("a-gifts")}>返回</Button>
      <Callout tone="info">善款不能更正金额和日期。金额或日期有误时，作废这笔后再重新导入。</Callout>
    </Stack>
  );
}

function VoidGiftFacts(props: { g: Gift; wide: boolean }) {
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const projectId = giftProjectId(props.g.projectId, gone);
  const project = projectId ? projectById(projectId) : undefined;
  const pairs: [string, string][] = [
    ["善款编号", props.g.no],
    ["订单编号", props.g.order],
    ["金额", yuan(props.g.amount)],
    ["捐款日期", props.g.date],
    ["当前项目", project ? `${project.name} · ${project.no}` : "尚未安排"],
    ["捐款平台", props.g.platform],
    ["平台用户 ID", props.g.pid],
    ["是否匿名", props.g.anon ? "匿名" : "不匿名"],
    ["对外展示名", props.g.display || "空"],
    ["身份手机号", props.g.phone || "未填写"],
    ["用户已修改", props.g.userEdited ? `是 · ${props.g.editedAt}` : "否"],
  ];
  return (
    <Stack gap={8}>
      <Grid columns={props.wide ? 2 : 1} gap={8}>
        {pairs.map(([label, value]) => (
          <Stack key={label} gap={2}>
            <Text size="small" tone="tertiary">{label}</Text>
            <Text size="small" style={{ overflowWrap: "anywhere" }}>{value}</Text>
          </Stack>
        ))}
      </Grid>
      <Stack gap={2}>
        <Text size="small" tone="tertiary">个人说明</Text>
        <Text size="small" style={{ overflowWrap: "anywhere" }}>{props.g.bio || "空"}</Text>
      </Stack>
      <Stack gap={2}>
        <Text size="small" tone="tertiary">备注</Text>
        <Text size="small" style={{ overflowWrap: "anywhere" }}>{props.g.remark || "无"}</Text>
      </Stack>
    </Stack>
  );
}

function AdminVoid(props: { ctx: Ctx }) {
  const raw = giftById(props.ctx.donationId);
  const edited = props.ctx.identityEdits[identityIdOf(raw)];
  const g = edited ? { ...raw, anon: edited.anon, display: edited.display, bio: edited.bio, userEdited: false, editedAt: "" } : raw;
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const projectId = giftProjectId(g.projectId, gone);
  const project = projectId ? projectById(projectId) : undefined;
  if (props.ctx.goneGifts.includes(raw.id)) {
    return (
      <Stack gap={8}>
        <Button variant="ghost" onClick={() => props.ctx.open(props.ctx.giftBack)}>返回</Button>
        <Callout tone="warning">这条善款已经作废，可以在「作废善款」里查看。</Callout>
      </Stack>
    );
  }
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open(props.ctx.giftBack)}>返回</Button>
      <VoidGiftFacts g={g} wide={props.ctx.adminWide} />
      <Text size="small">确认后从善款列表移出，记入「作废善款」，不再挂在项目上。作废时间取确认当时。作废原因写入这条作废记录的备注，原备注留在前面。</Text>
      {project ? (
        <Callout tone="info" title="当前挂在项目上">{`确认后不再挂在「${project.name}」上，合计减去 ${yuan(g.amount)}。`}</Callout>
      ) : (
        <Text size="small" tone="secondary">当前没有挂到项目。确认后记入「作废善款」。</Text>
      )}
      <Field label="作废原因">
        <TextArea value={reason} onChange={setReason} rows={3} />
      </Field>
      {error ? <Callout tone="warning">需要填写作废原因。</Callout> : null}
      <Row justify="end">
        <Button
          variant="primary"
          onClick={() => {
            if (!reason.trim()) {
              setError(true);
              return;
            }
            props.ctx.dropGift(g.id, reason);
            const lead = project ? `已作废，不再挂在项目上。「${project.name}」的合计已减去这笔。原因已写入备注。` : "已作废。原因已写入备注。";
            props.ctx.open(props.ctx.giftBack, lead);
          }}
        >
          确认作废
        </Button>
      </Row>
    </Stack>
  );
}

function AdminVoidBatch(props: { ctx: Ctx }) {
  const [step, setStep] = useState<"file" | "preview" | "done">("file");
  const [bad, setBad] = useState(false);
  const [note, setNote] = useState("");
  const [, setVoidFiles] = useCanvasState<BatchFile[]>("void-files", VOID_FILE_SEED);
  if (step === "file") {
    return (
      <Stack gap={8}>
        <Button variant="ghost" onClick={() => props.ctx.open("a-gifts")}>返回</Button>
        <Text size="small" tone="secondary">上传 Excel（.xlsx），单次最多 500 行。只读第一个工作表，第一行是表头。订单编号按文本填写。按订单编号找到善款，每行自带作废原因。任一行失败则整批不写入，也不保存文件。整批成功后，原文件存入「导入文档」的作废目录。</Text>
        {props.ctx.adminWide ? (
          <Table
            headers={["订单编号", "作废原因"]}
            rows={[
              ["4200001100202610100003", "重复录入"],
              ["2026100222001400000001", "录错项目"],
            ]}
            striped
          />
        ) : (
          <Text size="small" tone="secondary">示例：订单编号 4200001100202610100003，作废原因重复录入。</Text>
        )}
        {note ? <Text size="small">{note}</Text> : null}
        <Row gap={8} justify="end">
          <Button variant="secondary" onClick={() => setNote("已开始下载「善款作废模板.xlsx」。")}>下载模板</Button>
          <Button variant="primary" onClick={() => setStep("preview")}>上传文件并预览</Button>
        </Row>
      </Stack>
    );
  }
  if (step === "done") {
    return (
      <Stack gap={8}>
        <Callout tone="success" title="本批已作废">2 行全部通过。这些善款已记入「作废善款」，不再挂在项目上。挂过项目的，项目合计已减去对应金额。作废原因写在各条备注里。原 Excel 已存入作废目录。任一行失败时不保存文件。</Callout>
        <Text size="small">作废时间记在「作废善款」。公开页面和「我的」里看不到。身份记录还在。</Text>
        <Row gap={8} justify="end">
          <Button variant="ghost" onClick={() => setStep("file")}>再作废一批</Button>
          <Button variant="secondary" onClick={() => props.ctx.open("a-files")}>查看导入文档</Button>
          <Button variant="secondary" onClick={() => props.ctx.open("a-voided")}>查看作废善款</Button>
          <Button variant="primary" onClick={() => props.ctx.open("a-gifts")}>前往善款列表</Button>
        </Row>
      </Stack>
    );
  }
  return (
    <Stack gap={8}>
      <Text weight="semibold">作废预览</Text>
      <Checkbox checked={bad} onChange={setBad} label="加入一行错误，查看整批不写入" />
      {props.ctx.adminWide ? (
        <Table
          headers={["行", "订单编号", "结果"]}
          rows={[
            ["2", "4200001100202610100003", "将记入「作废善款」，不挂项目。备注写入作废原因「重复录入」。"],
            ["3", "2026100222001400000001", "将记入「作废善款」，不再挂在「秋季助学」上，合计减去 ¥500.50。备注写入作废原因「录错项目」。"],
            ...(bad ? [["4", "4200001100202610030005", "第 4 行失败"]] as string[][] : []),
          ]}
          rowTone={bad ? [undefined, undefined, "danger"] : undefined}
          striped
        />
      ) : [
        ["2", "4200001100202610100003", "将记入「作废善款」，不挂项目。备注写入作废原因「重复录入」。"],
        ["3", "2026100222001400000001", "将记入「作废善款」，不再挂在「秋季助学」上，合计减去 ¥500.50。备注写入作废原因「录错项目」。"],
        ...(bad ? [["4", "4200001100202610030005", "第 4 行失败"]] : []),
      ].map((row) => (
        <AdminLine key={row[0]}>
          <Text size="small" weight="semibold">第 {row[0]} 行</Text>
          <Text size="small" style={{ overflowWrap: "anywhere" }}>{row[1]}</Text>
          <Text size="small" tone="secondary">{row[2]}</Text>
        </AdminLine>
      ))}
      <Text size="small" tone="secondary">超过 500 行时不逐行写入。订单编号为空、找不到这笔、本批重复或原因为空，都算该行失败。挂在项目上的也可以作废。作废后不再挂项目，原因写入备注。</Text>
      {bad ? <Callout tone="danger" title="第 4 行">订单编号 4200001100202610030005 不存在。确认写入不可用，整批不写入。</Callout> : null}
      <Row gap={8} justify="end">
        <Button variant="ghost" onClick={() => setStep("file")}>返回修改文件</Button>
        <Button variant="primary" disabled={bad} onClick={() => {
          props.ctx.dropGift("sk3", "重复录入", "2026-10-19 10:27");
          props.ctx.dropGift("sk2", "录错项目", "2026-10-19 10:27");
          setVoidFiles((prev) => [{ id: `void-${prev.length + 1}`, name: "善款作废-20261019.xlsx", at: "2026-10-19 10:27", rows: 2 }, ...prev]);
          setStep("done");
        }}>确认写入</Button>
      </Row>
    </Stack>
  );
}

function AdminIdentities(props: { ctx: Ctx }) {
  const fields: QueryField[] = [
    { id: "pid", label: "平台用户 ID", kind: "key", placeholder: "平台用户 ID" },
    { id: "platform", label: "平台", kind: "category", options: ["全部", "微信支付", "支付宝"] },
    { id: "phone", label: "手机号", kind: "other", placeholder: "手机号" },
  ];
  const [query, setQuery] = useState<Record<string, string>>(() => blankQuery(fields));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const platform = query.platform ?? "全部";
  const pid = queryText(query, "pid");
  const phone = queryText(query, "phone");
  const list = allIdentities().map((item) => identityById(item.id, props.ctx.identityEdits)).filter((item) => {
    if (platform !== "全部" && item.platform !== platform) return false;
    if (pid && !hasText(item.pid, pid)) return false;
    if (phone && !containsQuery(phone, [item.phone, item.mask])) return false;
    return true;
  });
  const rows = takePage(list, page, !props.ctx.adminWide, pageSize);
  return (
    <Stack gap={8}>
      <Row justify="end">
        <Button variant="primary" onClick={() => props.ctx.open("a-identity-new")}>创建捐款身份</Button>
      </Row>
      <QueryForm wide={props.ctx.adminWide} fields={fields} onApply={(next) => { setQuery(next); setPage(1); }} />
      {list.length === 0 ? <Text size="small" tone="secondary">没有符合条件的捐款身份。</Text> : null}
      {props.ctx.adminWide ? (
        <Table
          headers={["平台", "平台用户 ID", "展示名", "匿名", "手机号", "用户已修改", "笔数", ""]}
          columnAlign={["left", "left", "left", "left", "left", "left", "right", "right"]}
          rows={rows.map((item) => {
            const count = keptGifts(props.ctx.goneGifts).filter((gift) => identityIdOf(gift) === item.id).length;
            return [
              item.platform,
              item.pid,
              item.anon ? "—" : (item.display || "—"),
              item.anon ? "是" : "否",
              <Reveal key={item.id} mask={item.mask || "未填写"} full={item.phone} />,
              item.userEdited ? "是" : "否",
              String(count),
              <Button key={`${item.id}-open`} variant="ghost" onClick={() => props.ctx.showIdentity(item.id)}>打开</Button>,
            ];
          })}
          striped
        />
      ) : rows.map((item) => {
        const count = keptGifts(props.ctx.goneGifts).filter((gift) => identityIdOf(gift) === item.id).length;
        return (
          <RecordCard
            key={item.id}
            name={item.anon ? "匿名捐款人" : (item.display || "未填展示名")}
            status={item.anon ? "匿名" : "不匿名"}
            marks={[{ label: item.userEdited ? "用户已修改" : "用户未修改", active: item.userEdited }]}
            action={<Button variant="ghost" onClick={() => props.ctx.showIdentity(item.id)}>打开</Button>}
          >
            <Text size="small" tone="secondary">{item.platform} · {item.pid}</Text>
            <Text size="small" tone="secondary">{count} 笔</Text>
            <Row gap={8} align="center">
              <Text size="small">手机号</Text>
              <Reveal mask={item.mask || "未填写"} full={item.phone} />
            </Row>
          </RecordCard>
        );
      })}
      <Pager page={page} total={list.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite={!props.ctx.adminWide} />
      <Text size="small" tone="tertiary">尚无善款的身份也留在列表中。单笔录入按条件查询后添加身份。</Text>
    </Stack>
  );
}

function AdminIdentityNew(props: { ctx: Ctx }) {
  const [platform, setPlatform] = useState("微信支付");
  const [pid, setPid] = useState("oDemo002");
  const [anon, setAnon] = useState(true);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("a-identities")}>返回</Button>
      <Text size="small" tone="secondary">只创建捐款身份，不产生善款，也不标记「用户已修改」。平台和平台用户 ID 创建后不能改。</Text>
      <Grid columns={props.ctx.adminWide ? 2 : 1} gap={10}>
        <Field label="平台">
          <Select value={platform} onChange={setPlatform} options={[{ value: "微信支付", label: "微信支付" }, { value: "支付宝", label: "支付宝" }]} />
        </Field>
        <Field label="平台用户 ID" hint="最长 64 个字符。与平台组成身份键。">
          <TextInput value={pid} onChange={setPid} />
        </Field>
      </Grid>
      <Row gap={8} align="center">
        <Text size="small">匿名（默认是）</Text>
        <Toggle checked={anon} onChange={setAnon} />
      </Row>
      <Field label="对外展示名">
        <TextInput value={name} onChange={setName} />
      </Field>
      <Field label="个人说明">
        <TextArea value={bio} onChange={setBio} rows={2} />
      </Field>
      <Field label="手机号" hint="选填。11 位中国大陆手机号。捐款人不能修改，批量导入有值时会更新。">
        <TextInput value={phone} onChange={setPhone} />
      </Field>
      {error ? <Callout tone="warning">{error}</Callout> : null}
      <Row justify="end">
        <Button
          variant="primary"
          onClick={() => {
            const key = pid.trim();
            if (!key || key.length > 64) {
              setError("平台用户 ID 必填，且不超过 64 个字符。未保存。");
              return;
            }
            if (allIdentities().some((item) => item.platform === platform && item.pid === key)) {
              setError("该身份键已经存在。未保存。");
              return;
            }
            if (bio.length > 200) {
              setError("个人说明超出 200 字。未保存。");
              return;
            }
            if (phone.trim() && !/^\d{11}$/.test(phone.trim())) {
              setError("手机号需为 11 位，或留空。未保存。");
              return;
            }
            props.ctx.showIdentity("id0");
            props.ctx.open("a-identity", "身份已创建，尚未产生善款。此处打开示例身份：微信支付 oNew001。");
          }}
        >
          保存
        </Button>
      </Row>
    </Stack>
  );
}

function AdminIdentity(props: { ctx: Ctx }) {
  const seed = identityById(props.ctx.identityId, props.ctx.identityEdits);
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const rows = keptGifts(props.ctx.goneGifts).filter((gift) => identityIdOf(gift) === seed.id);
  return (
    <Stack gap={8}>
      <Notice text={props.ctx.notice} />
      <Button variant="ghost" onClick={() => props.ctx.open("a-identities")}>返回身份列表</Button>
      <Text weight="semibold">{seed.platform} · {seed.pid}</Text>
      <Text size="small">{seed.anon ? "匿名" : "不匿名"} · 展示名 {seed.display || "空"}</Text>
      <Text size="small">个人说明：{seed.bio || "空"}</Text>
      <Row gap={8} align="center">
        <Text size="small">手机号</Text>
        <Reveal mask={seed.mask || "未填写"} full={seed.phone} />
      </Row>
      <Text size="small" tone="secondary">用户已修改：{seed.userEdited ? `是 · ${seed.editedAt}` : "否"}</Text>
      <Row justify="end">
        <Button variant="secondary" onClick={() => props.ctx.open("a-identity-edit")}>更正匿名、对外展示名、个人说明</Button>
      </Row>
      <Divider />
      <SectionList
        title="名下善款"
        wide={props.ctx.adminWide}
        infinite={!props.ctx.adminWide}
        fields={[
          { id: "order", label: "订单编号", kind: "key", placeholder: "订单编号" },
          { id: "arrange", label: "项目", kind: "category", options: ["全部", "已安排", "尚未安排"] },
          { id: "from", label: "捐款日期起", kind: "time", placeholder: "YYYY-MM-DD" },
          { id: "to", label: "捐款日期止", kind: "time", placeholder: "YYYY-MM-DD" },
        ]}
        rows={rows}
        match={(gift, values) => {
          const projectId = giftProjectId(gift.projectId, gone);
          if (queryText(values, "order") && !hasText(gift.order, queryText(values, "order"))) return false;
          if (values.arrange === "已安排" && !projectId) return false;
          if (values.arrange === "尚未安排" && projectId) return false;
          return inDates(gift.date, queryText(values, "from"), queryText(values, "to"));
        }}
        empty="没有符合条件的善款。"
        idleEmpty="还没有善款。到善款列表单笔录入，并查询添加此身份。"
        columns={{
          headers: ["订单编号", "善款编号", "金额", "项目", "日期"],
          align: ["left", "left", "right", "left", "left"],
          cells: (gift) => [
            gift.order,
            gift.no,
            yuan(gift.amount),
            giftProjectId(gift.projectId, gone) ? (projectById(giftProjectId(gift.projectId, gone))?.name ?? "—") : "尚未安排",
            gift.date,
          ],
        }}
        render={(gift) => (
          <RecordCard
            key={gift.id}
            name={publicName(gift)}
            date={gift.date}
          >
            <Text size="small" tone="secondary">{yuan(gift.amount)} · {gift.no}</Text>
            <Text size="small" tone="secondary" style={{ overflowWrap: "anywhere" }}>订单 {gift.order}</Text>
          </RecordCard>
        )}
      />
    </Stack>
  );
}

function AdminIdentityEdit(props: { ctx: Ctx }) {
  const seed = identityById(props.ctx.identityId, props.ctx.identityEdits);
  const [anon, setAnon] = useState(seed.anon);
  const [name, setName] = useState(seed.display);
  const [bio, setBio] = useState(seed.bio);
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("a-identity")}>返回</Button>
      <Text size="small" tone="secondary">用户已修改过也可以更正。保存后标记改为「用户未修改」，修改时间清空，也不新增善款。手机号不在本页修改。</Text>
      <Row gap={8} align="center">
        <Text size="small">匿名</Text>
        <Toggle checked={anon} onChange={setAnon} />
      </Row>
      <Field label="对外展示名">
        <TextInput value={name} onChange={setName} />
      </Field>
      <Field label="个人说明">
        <TextArea value={bio} onChange={setBio} rows={3} />
      </Field>
      <Row justify="end">
        <Button variant="primary" onClick={() => { props.ctx.saveIdentityEdit(seed.id, anon, name, bio); props.ctx.open("a-identity", "三项已更新。用户已修改已改为否，修改时间已清空。"); }}>保存</Button>
      </Row>
    </Stack>
  );
}

function AdminPickGift(props: { ctx: Ctx }) {
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const pool = keptGifts(props.ctx.goneGifts).filter((gift) => !giftProjectId(gift.projectId, gone)).slice().sort((a, b) => b.date.localeCompare(a.date));
  const fields: QueryField[] = [
    { id: "order", label: "订单编号", kind: "key", placeholder: "订单编号" },
    { id: "no", label: "善款编号", kind: "key", placeholder: "善款编号" },
    { id: "pid", label: "平台用户 ID", kind: "key", placeholder: "平台用户 ID" },
  ];
  const [query, setQuery] = useState<Record<string, string> | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const order = queryText(query ?? {}, "order");
  const no = queryText(query ?? {}, "no");
  const pid = queryText(query ?? {}, "pid");
  const active = Boolean(order || no || pid);
  const hits = (active ? pool.filter((gift) => hasText(gift.order, order) && hasText(gift.no, no) && hasText(gift.pid, pid)) : pool);
  const mobileSize = 5;
  const mobilePages = Math.max(1, Math.ceil(hits.length / mobileSize));
  const mobilePage = Math.min(Math.max(1, page), mobilePages);
  const mobileHits = hits.slice((mobilePage - 1) * mobileSize, mobilePage * mobileSize);
  const confirm = () => props.ctx.open("a-project", "已绑定。项目善款合计和结余已包含这笔全额。");
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("a-project")}>返回</Button>
      <Text size="small">还没挂到项目上的善款，按捐款日期从新到旧分页。桌面每页 10 条，移动每页 5 条。也可按订单编号、善款编号或平台用户 ID 查询。绑定的是全额。</Text>
      <QueryForm wide={props.ctx.adminWide} fields={fields} onApply={(next) => { setQuery(next); setPage(1); }} />
      {pool.length === 0 ? <Text size="small" tone="secondary">当前没有尚未安排的善款。</Text> : null}
      {pool.length > 0 && active && hits.length === 0 ? <Text size="small" tone="secondary">没有匹配的尚未安排善款。</Text> : null}
      {hits.length > 0 && props.ctx.adminWide ? (
        <Table
          headers={["订单编号", "善款编号", "金额", "日期", "平台", "平台用户 ID", "展示名", ""]}
          columnAlign={["left", "left", "right", "left", "left", "left", "left", "right"]}
          rows={takePage(hits, page, false, pageSize).map((gift) => [
            gift.order,
            gift.no,
            yuan(gift.amount),
            gift.date,
            gift.platform,
            gift.pid,
            publicName(gift),
            <Button key={`${gift.id}-ok`} variant="primary" onClick={confirm}>确认</Button>,
          ])}
          striped
        />
      ) : null}
      {!props.ctx.adminWide ? mobileHits.map((gift) => (
        <RecordCard
          key={gift.id}
          name={publicName(gift)}
          date={gift.date}
          action={<Button variant="primary" onClick={confirm}>确认</Button>}
        >
          <Text size="small" tone="secondary">{yuan(gift.amount)} · {gift.platform} · {gift.no}</Text>
          <Text size="small" tone="secondary" style={{ overflowWrap: "anywhere" }}>订单 {gift.order} · {gift.pid}</Text>
        </RecordCard>
      )) : null}
      {hits.length > 0 ? (
        props.ctx.adminWide
          ? <Pager page={page} total={hits.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} />
          : <PersonStepPager page={page} total={hits.length} pageSize={5} onPage={setPage} />
      ) : null}
    </Stack>
  );
}

function AdminProjects(props: { ctx: Ctx }) {
  const theme = useHostTheme();
  const fields: QueryField[] = [
    { id: "no", label: "项目编号", kind: "key", placeholder: "项目编号" },
    { id: "name", label: "项目名称", kind: "name", placeholder: "项目名称" },
    { id: "status", label: "状态", kind: "category", options: ["全部", "进行中", "已完成", "已关闭", "超支"] },
  ];
  const [query, setQuery] = useState<Record<string, string>>(() => blankQuery(fields));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const status = query.status ?? "全部";
  const list = withoutGone(gone).filter((project) => {
    if (queryText(query, "no") && !hasText(project.no, queryText(query, "no"))) return false;
    if (queryText(query, "name") && !hasText(project.name, queryText(query, "name"))) return false;
    if (status === "超支") return isOver(project);
    if (status !== "全部" && project.status !== status) return false;
    return true;
  }).slice().sort((a, b) => b.start.localeCompare(a.start));
  const rows = takePage(list, page, !props.ctx.adminWide, pageSize);
  const actions = (project: Project) => (
    <Button variant="secondary" onClick={() => props.ctx.showAdminProject(project.id)}>打开</Button>
  );
  return (
    <Stack gap={10}>
      <Notice text={props.ctx.notice} />
      <Row justify="end">
        <Button variant="primary" onClick={() => { props.ctx.setLockPerson(false); props.ctx.open("a-project-new"); }}>新建项目</Button>
      </Row>
      <QueryForm wide={props.ctx.adminWide} fields={fields} onApply={(next) => { setQuery(next); setPage(1); }} />
      {list.length === 0 ? <Text tone="secondary">没有符合条件的项目。</Text> : null}
      {props.ctx.adminWide ? (
        <Table
          headers={["项目编号", "名称", "状态", "开始日期", "善款", "开销", "结余", "受益人", ""]}
          columnAlign={["left", "left", "left", "left", "right", "right", "right", "right", "right"]}
          rows={rows.map((project) => [
            project.no,
            project.name,
            isOver(project) ? `${project.status} · 超支` : project.status,
            project.start,
            yuan(project.income),
            yuan(project.expense),
            yuan(balanceOf(project)),
            `${project.people} 名`,
            <Row key={`${project.id}-ops`} gap={6} justify="end">{actions(project)}</Row>,
          ])}
          striped
        />
      ) : rows.map((project) => (
        <div key={project.id} style={{ padding: "8px 0", borderBottom: `1px solid ${theme.stroke.tertiary}` }}>
          <Stack gap={4}>
            <ProjectLines p={project} admin />
            <Row gap={6} justify="end">{actions(project)}</Row>
          </Stack>
        </div>
      ))}
      <Pager page={page} total={list.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite={!props.ctx.adminWide} />
    </Stack>
  );
}

function AdminProjectNew(props: { ctx: Ctx }) {
  const locked = props.ctx.lockPerson ? personById(props.ctx.personId) : undefined;
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [start, setStart] = useState("2026-10-19");
  const [picked, setPicked] = useState<string[]>(locked ? [locked.id] : []);
  const [error, setError] = useState("");
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open(locked ? "a-person" : "a-projects")}>返回</Button>
      <Field label="项目名称" hint="不超过 50 字。">
        <TextInput value={name} onChange={setName} />
      </Field>
      <Field label="项目简介">
        <TextArea value={summary} onChange={setSummary} rows={2} />
      </Field>
      <Field label="开始日期">
        <TextInput value={start} onChange={setStart} />
      </Field>
      <PersonQuery
        ctx={props.ctx}
        picked={picked}
        lockedId={locked?.id}
        allowCreate
        foldAdd
        recent
        onAdd={(id) => setPicked((prev) => (prev.includes(id) ? prev : [...prev, id]))}
        onRemove={(id) => setPicked((prev) => prev.filter((item) => item !== id))}
      />
      {error ? <Callout tone="warning">{error}</Callout> : null}
      {props.ctx.adminWide ? null : <Divider />}
      <Row justify="end">
        <Button
          variant="primary"
          onClick={() => {
            if (!name.trim() || name.length > 50 || !summary.trim() || !start) {
              setError("请补全必填项。名称不超过 50 字。");
              return;
            }
            if (picked.length === 0) {
              setError("请至少选择一名受益人。");
              return;
            }
            props.ctx.showAdminProject("xm3");
            props.ctx.open("a-project", "已创建，状态为进行中，三项金额为 0。此处用「冬季取暖」代表刚创建、尚无善款的项目。");
          }}
        >
          保存
        </Button>
      </Row>
    </Stack>
  );
}

function AdminProject(props: { ctx: Ctx }) {
  const project = projectById(props.ctx.projectId) ?? PROJECTS[1];
  const [status, setStatus] = useState(project.status);
  const [removed, setRemoved] = useState(false);
  const [msg, setMsg] = useState("");
  const [goneUpdates, setGoneUpdates] = useState<string[]>([]);
  const [releasedGifts, setReleasedGifts] = useState<string[]>([]);
  const [, setEditNo] = useCanvasState("progress-edit", "");
  const [, setExpenseNo] = useCanvasState("expense-edit", "");
  const people = PEOPLE.filter((p) => p.projects.includes(project.id) && !(removed && p.id === "p2"));
  const running = status === "进行中";
  const wide = props.ctx.adminWide;
  const updates = UPDATES.filter((update) => update.projectId === project.id && !goneUpdates.includes(update.no)).sort((a, b) => b.date.localeCompare(a.date));
  const editUpdate = (no: string) => {
    setEditNo(no);
    props.ctx.open("a-progress-edit");
  };
  const deleteUpdate = (no: string) => {
    setGoneUpdates((prev) => (prev.includes(no) ? prev : [...prev, no]));
    setMsg("已删除。公开页面也不再展示。");
  };
  const editExpense = (no: string) => {
    setExpenseNo(no);
    props.ctx.open("a-expense-edit");
  };
  const boundGifts = keptGifts(props.ctx.goneGifts)
    .filter((gift) => gift.projectId === project.id && !releasedGifts.includes(gift.id))
    .sort((a, b) => b.date.localeCompare(a.date));
  const removePerson = (personId: string) => (
    <Button
      key={`${personId}-rm`}
      variant="ghost"
      onClick={() => {
        if (people.length <= 1) setMsg("项目至少保留一名受益人。");
        else {
          setRemoved(true);
          setMsg("已移除。对方登录后不再在这个项目上看到「包含我」。");
        }
      }}
    >
      移除
    </Button>
  );
  const giftActions = (gift: Gift) => (
    <>
      <Button variant="ghost" onClick={() => props.ctx.showIdentity(identityIdOf(gift))}>打开身份</Button>
      <Button variant="ghost" onClick={() => props.ctx.openGift(gift.id, "a-void")}>作废</Button>
      <Button variant="secondary" onClick={() => {
        setReleasedGifts((prev) => (prev.includes(gift.id) ? prev : [...prev, gift.id]));
        setMsg("已解除。这笔不再挂在项目上，合计会减去这笔全额。");
      }}>解除绑定</Button>
    </>
  );
  return (
    <Stack gap={8}>
      <Notice text={props.ctx.notice} />
      <Row justify="space-between" align="center" style={{ flexWrap: "nowrap" }}>
        <Text as="span" size="small" tone="tertiary" style={{ whiteSpace: "nowrap", flex: "0 0 auto" }}>{project.no}</Text>
        <Button variant="ghost" style={{ whiteSpace: "nowrap", flex: "0 0 auto" }} onClick={() => props.ctx.open("a-projects")}>返回列表</Button>
      </Row>
      <Row gap={6} wrap>
        <Text weight="semibold">{project.name}</Text>
        <Pill size="sm" active={running}>{status}</Pill>
        {isOver(project) ? <Pill size="sm" active>超支</Pill> : null}
      </Row>
      {project.cover ? <Cover /> : null}
      <Text size="small">{project.summary}</Text>
      <Text size="small" tone="secondary">{project.start}</Text>
      <AmountLine project={project} />
      {msg ? <Callout tone="info">{msg}</Callout> : null}
      <Row gap={8} wrap justify="end">
        {running ? <Button variant="secondary" onClick={() => props.ctx.open("a-project-edit")}>编辑</Button> : null}
        {running ? <Button variant="ghost" onClick={() => setStatus("已完成")}>标记完成</Button> : null}
        {running ? <Button variant="ghost" onClick={() => setStatus("已关闭")}>标记关闭</Button> : null}
        {!running ? <Button variant="secondary" onClick={() => setStatus("进行中")}>改回进行中</Button> : null}
      </Row>
      <Divider />
      {wide ? (
        <Stack gap={8}>
          <SectionTitle
            title="受益人"
            action={running ? <Button variant="secondary" onClick={() => props.ctx.open("a-add-person")}>追加受益人</Button> : undefined}
          />
          {people.length === 0 ? <Text size="small" tone="secondary">还没有受益人。</Text> : (
            <Table
              headers={running ? ["姓名", "唯一 ID", "备注", ""] : ["姓名", "唯一 ID", "备注"]}
              columnAlign={running ? ["left", "left", "left", "right"] : ["left", "left", "left"]}
              striped
              rows={people.map((person) => {
                const row = [
                  person.name,
                  <Reveal key={person.id} mask={person.mask} full={person.idNo} />,
                  person.note || "无",
                ];
                return running ? [...row, removePerson(person.id)] : row;
              })}
            />
          )}
        </Stack>
      ) : (
        <Stack gap={8}>
          <SectionTitle
            title="受益人"
            action={running ? <Button variant="secondary" onClick={() => props.ctx.open("a-add-person")}>追加受益人</Button> : undefined}
          />
          {people.length === 0 ? <Text size="small" tone="secondary">还没有受益人。</Text> : people.map((person, index) => (
            <RecordCard
              key={person.id}
              name={person.name}
              aside={<Reveal mask={person.mask} full={person.idNo} />}
              line={index < people.length - 1}
              action={running ? removePerson(person.id) : undefined}
            >
              <Text size="small" tone="secondary">{person.note || "无"}</Text>
            </RecordCard>
          ))}
        </Stack>
      )}
      <Divider />
      {wide ? (
        <Stack gap={8}>
          <SectionTitle
            title="进展"
            action={running ? <Button variant="secondary" onClick={() => props.ctx.open("a-progress")}>发布进展</Button> : undefined}
          />
          {updates.length === 0 ? <Text size="small" tone="secondary">暂无进展。</Text> : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, minWidth: 0 }}>
              {updates.map((update) => (
                <ProgressCard
                  key={update.no}
                  update={update}
                  sideBySide
                  onEdit={() => editUpdate(update.no)}
                  onDelete={() => deleteUpdate(update.no)}
                />
              ))}
            </div>
          )}
        </Stack>
      ) : (
        <FoldList
          title="进展"
          rows={updates}
          empty="暂无进展。"
          step={2}
          action={running ? <Button variant="secondary" onClick={() => props.ctx.open("a-progress")}>发布进展</Button> : undefined}
          render={(update) => (
            <ProgressCard
              key={update.no}
              update={update}
              onEdit={() => editUpdate(update.no)}
              onDelete={() => deleteUpdate(update.no)}
            />
          )}
        />
      )}
      <Divider />
      <FoldList
        title="善款"
        wide={wide}
        fold={!wide}
        step={wide ? undefined : 5}
        action={<Button variant="secondary" onClick={() => props.ctx.open("a-pick-gift")}>绑定善款</Button>}
        rows={boundGifts}
        empty="还没有有效绑定。"
        columns={{
          headers: ["善款编号", "金额", "捐款身份姓名", "日期", "捐款平台", "订单编号", ""],
          align: ["left", "right", "left", "left", "left", "left", "right"],
          cells: (gift) => [
            gift.no,
            yuan(gift.amount),
            publicName(gift),
            gift.date,
            gift.platform,
            gift.order,
            <Row key={`${gift.id}-ops`} gap={6} justify="end" wrap>{giftActions(gift)}</Row>,
          ],
        }}
        render={(gift) => (
          <RecordCard
            key={gift.id}
            name={`${yuan(gift.amount)} ${publicName(gift)}`}
            date={gift.date}
            action={giftActions(gift)}
          >
            <Text size="small" tone="secondary">{gift.no}</Text>
            <Text size="small" tone="secondary" style={{ overflowWrap: "anywhere" }}>{gift.platform} {gift.order}</Text>
          </RecordCard>
        )}
      />
      <Divider />
      <FoldList
        title="开销"
        wide={wide}
        fold={!wide}
        step={wide ? undefined : 5}
        action={<Button variant="primary" onClick={() => props.ctx.open("a-expense")}>登记开销</Button>}
        rows={EXPENSES.filter((expense) => expense.projectId === project.id && !props.ctx.goneExpenses.includes(expense.no)).sort((a, b) => b.date.localeCompare(a.date))}
        empty="暂无开销。"
        columns={{
          headers: ["开销编号", "日期", "类别", "金额", "说明", ""],
          align: ["left", "left", "left", "right", "left", "right"],
          cells: (expense) => [
            expense.no,
            expense.date,
            expense.cat,
            yuan(expense.amount),
            expense.note,
            <Row key={`${expense.no}-ops`} gap={6} justify="end" wrap>
              <Button variant="ghost" onClick={() => editExpense(expense.no)}>编辑</Button>
              <Button variant="secondary" onClick={() => { props.ctx.dropExpense(expense.no); setMsg("已删除。公开页面也不再展示，合计会减去这笔。"); }}>删除</Button>
            </Row>,
          ],
        }}
        render={(expense) => (
          <RecordCard
            key={expense.no}
            name={expense.note || expense.cat}
            date={expense.date}
            action={
              <>
                <Button variant="ghost" onClick={() => editExpense(expense.no)}>编辑</Button>
                <Button variant="secondary" onClick={() => { props.ctx.dropExpense(expense.no); setMsg("已删除。公开页面也不再展示，合计会减去这笔。"); }}>删除</Button>
              </>
            }
          >
            <Text size="small" tone="secondary">{expense.cat} · {yuan(expense.amount)} · {expense.no}</Text>
          </RecordCard>
        )}
      />
    </Stack>
  );
}

function AdminProjectEdit(props: { ctx: Ctx }) {
  const project = projectById(props.ctx.projectId) ?? PROJECTS[1];
  const [name, setName] = useState(project.name);
  const [summary, setSummary] = useState(project.summary);
  const [start, setStart] = useState(project.start);
  if (project.status !== "进行中") {
    return (
      <Stack gap={8}>
        <Callout tone="info">已完成或已关闭要先改回进行中，才能编辑。</Callout>
        <Button variant="ghost" onClick={() => props.ctx.open("a-project")}>返回详情</Button>
      </Stack>
    );
  }
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("a-project")}>返回</Button>
      <Field label="项目名称"><TextInput value={name} onChange={setName} /></Field>
      <Field label="项目简介"><TextArea value={summary} onChange={setSummary} rows={2} /></Field>
      <Field label="开始日期"><TextInput value={start} onChange={setStart} /></Field>
      <Text size="small" tone="tertiary">受益人的追加和移除在项目详情里做。</Text>
      <Row justify="end">
        <Button variant="primary" onClick={() => props.ctx.open("a-project", "资料已更新，状态仍是进行中。")}>保存</Button>
      </Row>
    </Stack>
  );
}

function AdminAddPerson(props: { ctx: Ctx }) {
  const project = projectById(props.ctx.projectId) ?? PROJECTS[1];
  const [picked, setPicked] = useState<string[]>([]);
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("a-project")}>返回</Button>
      <Text size="small" tone="secondary">只在尚未关联到「{project.name}」的档案中查询。</Text>
      <PersonQuery
        ctx={props.ctx}
        recent
        picked={picked}
        excludeIds={PEOPLE.filter((person) => person.projects.includes(project.id)).map((person) => person.id)}
        onAdd={(id) => setPicked((prev) => (prev.includes(id) ? prev : [...prev, id]))}
        onRemove={(id) => setPicked((prev) => prev.filter((item) => item !== id))}
      />
      <Row justify="end">
        <Button variant="primary" disabled={picked.length === 0} onClick={() => props.ctx.open("a-project", "已追加。对方尚未登录也不影响，绑定成功后即可看到「包含我」。")}>保存</Button>
      </Row>
    </Stack>
  );
}

function AdminExpense(props: { ctx: Ctx; mode?: "edit" }) {
  const [editNo] = useCanvasState("expense-edit", "");
  const editing = props.mode === "edit" ? EXPENSES.find((item) => item.no === editNo && !props.ctx.goneExpenses.includes(item.no)) : undefined;
  const [date, setDate] = useState(editing?.date ?? "2026-10-19");
  const [cat, setCat] = useState(editing?.cat ?? "物资采购");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [note, setNote] = useState(editing?.note ?? "");
  const [error, setError] = useState("");
  if (props.mode === "edit" && !editing) {
    return (
      <Stack gap={8}>
        <Button variant="ghost" onClick={() => props.ctx.open("a-project")}>返回详情</Button>
        <Callout tone="warning">这条开销已经不在。</Callout>
      </Stack>
    );
  }
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("a-project")}>返回</Button>
      <Text size="small" tone="secondary">开销不改写某一笔善款，也不填写分摊对象。大于结余时仍然保存，并标记超支。</Text>
      <Field label="开销日期"><TextInput value={date} onChange={setDate} /></Field>
      <Field label="类别">
        <Select
          value={cat}
          onChange={setCat}
          options={["物资采购", "交通食宿", "人员补贴", "其他"].map((v) => ({ value: v, label: v }))}
        />
      </Field>
      <Field label="金额"><TextInput value={amount} onChange={setAmount} /></Field>
      <Field label="说明"><TextArea value={note} onChange={setNote} rows={2} /></Field>
      {error ? <Callout tone="warning">{error}</Callout> : null}
      <Row justify="end">
        <Button
          variant="primary"
          onClick={() => {
            const n = Number(amount);
            if (!date || !cat || !note.trim() || !(n > 0)) {
              setError("请填写不晚于今天的日期、类别、大于 0 的金额，以及公开说明。");
              return;
            }
            props.ctx.open("a-project", props.mode === "edit" ? "开销已更新，合计与结余已重算。" : n > 1000 ? "已保存。结余为负，页面标记超支。" : "已登记开销，合计与结余已重算。");
          }}
        >
          保存
        </Button>
      </Row>
    </Stack>
  );
}

function AdminProgress(props: { ctx: Ctx; mode?: "edit" }) {
  const project = projectById(props.ctx.projectId) ?? PROJECTS[1];
  const [editNo] = useCanvasState("progress-edit", "");
  const editing = props.mode === "edit" ? UPDATES.find((item) => item.no === editNo) : undefined;
  const [date, setDate] = useState(editing?.date ?? "2026-10-19");
  const [title, setTitle] = useState(editing?.title ?? "");
  const [body, setBody] = useState(editing?.body ?? "");
  if (props.mode === "edit" && !editing) {
    return (
      <Stack gap={8}>
        <Callout tone="info">没有找到这条进展。</Callout>
        <Button variant="ghost" onClick={() => props.ctx.open("a-project")}>返回详情</Button>
      </Stack>
    );
  }
  if (props.mode !== "edit" && project.status !== "进行中") {
    return (
      <Stack gap={8}>
        <Callout tone="info">已完成或已关闭的项目没有「发布进展」。已发布的仍可在详情中编辑或删除。</Callout>
        <Button variant="ghost" onClick={() => props.ctx.open("a-project")}>返回详情</Button>
      </Stack>
    );
  }
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("a-project")}>返回</Button>
      <Field label="日期"><TextInput value={date} onChange={setDate} /></Field>
      <Field label="标题"><TextInput value={title} onChange={setTitle} /></Field>
      <Field label="正文"><TextArea value={body} onChange={setBody} rows={3} /></Field>
      <Text size="small" tone="tertiary">图片选填。</Text>
      <Row justify="end">
        <Button
          variant="primary"
          onClick={() => props.ctx.open("a-project", props.mode === "edit" ? "进展已更新。" : "已发布。公开详情同时能看到。编号形如 JZ202610190001。")}
        >
          {props.mode === "edit" ? "保存" : "发布"}
        </Button>
      </Row>
    </Stack>
  );
}

function AdminPeople(props: { ctx: Ctx }) {
  const fields: QueryField[] = [
    { id: "id", label: "唯一 ID", kind: "key", placeholder: "唯一 ID" },
    { id: "name", label: "姓名", kind: "name", placeholder: "姓名" },
  ];
  const [query, setQuery] = useState<Record<string, string>>(() => blankQuery(fields));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const name = queryText(query, "name");
  const idNo = queryText(query, "id");
  const list = PEOPLE.filter((person) => hasText(person.name, name) && (!idNo || containsQuery(idNo, [person.idNo, person.mask])));
  const rows = takePage(list, page, !props.ctx.adminWide, pageSize);
  return (
    <Stack gap={10}>
      <Row justify="end">
        <Button variant="primary" onClick={() => props.ctx.open("a-person-new")}>新建受益人</Button>
      </Row>
      <QueryForm wide={props.ctx.adminWide} fields={fields} onApply={(next) => { setQuery(next); setPage(1); }} />
      {list.length === 0 ? <Text size="small" tone="secondary">没有符合条件的受益人。</Text> : null}
      {props.ctx.adminWide ? (
        <Table
          headers={["姓名", "唯一 ID", "备注", ""]}
          columnAlign={["left", "left", "left", "right"]}
          rows={rows.map((person) => [
            person.name,
            <Reveal key={person.id} mask={person.mask} full={person.idNo} />,
            person.note,
            <Button key={`${person.id}-open`} variant="ghost" onClick={() => props.ctx.showPerson(person.id)}>打开</Button>,
          ])}
          striped
        />
      ) : rows.map((person) => (
        <RecordCard
          key={person.id}
          name={person.name}
          aside={<Reveal mask={person.mask} full={person.idNo} />}
          action={<Button variant="ghost" onClick={() => props.ctx.showPerson(person.id)}>打开</Button>}
        >
          <Text size="small" tone="secondary">{person.note || "无"}</Text>
        </RecordCard>
      ))}
      <Pager page={page} total={list.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite={!props.ctx.adminWide} />
    </Stack>
  );
}

function AdminPersonNew(props: { ctx: Ctx }) {
  const [name, setName] = useState("");
  const [idNo, setIdNo] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("a-people")}>返回</Button>
      <Field label="姓名"><TextInput value={name} onChange={setName} /></Field>
      <Field label="唯一 ID" hint="档案内唯一，加密存储。页面默认只显示前 3 位和后 4 位。">
        <TextInput value={idNo} onChange={setIdNo} />
      </Field>
      <Field label="备注" hint="仅管理人员可见。">
        <TextInput value={note} onChange={setNote} />
      </Field>
      {error ? <Callout tone="warning">{error}</Callout> : null}
      <Row justify="end">
        <Button
          variant="primary"
          onClick={() => {
            if (!name.trim() || !idNo.trim()) {
              setError("姓名和唯一 ID 都要填写。");
              return;
            }
            if (PEOPLE.some((p) => p.idNo === idNo.trim())) {
              setError("唯一 ID 与已有档案重复，未产生档案。");
              return;
            }
            props.ctx.open("a-person", "已保存，进入受益人详情。");
          }}
        >
          保存
        </Button>
      </Row>
    </Stack>
  );
}

function AdminPerson(props: { ctx: Ctx }) {
  const person = personById(props.ctx.personId);
  const [gone] = useCanvasState<string[]>("gone-projects", []);
  const joined = withoutGone(gone).filter((p) => person.projects.includes(p.id));
  return (
    <Stack gap={8}>
      <Button variant="ghost" onClick={() => props.ctx.open("a-people")}>返回列表</Button>
      <Text weight="semibold">{person.name}</Text>
      <Row gap={8} align="center">
        <Text size="small">唯一 ID</Text>
        <Reveal mask={person.mask} full={person.idNo} />
      </Row>
      <Text size="small">备注：{person.note}</Text>
      <Row justify="end">
        <Button
          variant="primary"
          onClick={() => {
            props.ctx.setLockPerson(true);
            props.ctx.open("a-project-new");
          }}
        >
          创建项目
        </Button>
      </Row>
      <Divider />
      <SectionList
        title="已加入的项目"
        wide={props.ctx.adminWide}
        infinite={!props.ctx.adminWide}
        fields={[
          { id: "no", label: "项目编号", kind: "key", placeholder: "项目编号" },
          { id: "name", label: "项目名称", kind: "name", placeholder: "项目名称" },
        ]}
        rows={joined}
        match={(project, values) => hasText(project.name, queryText(values, "name")) && hasText(project.no, queryText(values, "no"))}
        empty="没有符合条件的项目。"
        idleEmpty="还没有加入项目。"
        columns={{
          headers: ["项目编号", "名称", "状态", "开始日期", "善款", "开销", "结余", "受益人", ""],
          align: ["left", "left", "left", "left", "right", "right", "right", "right", "right"],
          cells: (project) => [
            project.no,
            project.name,
            isOver(project) ? `${project.status} · 超支` : project.status,
            project.start,
            yuan(project.income),
            yuan(project.expense),
            yuan(balanceOf(project)),
            `${project.people} 名`,
            <Button key={`${project.id}-open`} variant="ghost" onClick={() => props.ctx.showAdminProject(project.id)}>打开</Button>,
          ],
        }}
        render={(project) => (
          <Hit key={project.id} onClick={() => props.ctx.showAdminProject(project.id)}>
            <ProjectLines p={project} admin />
          </Hit>
        )}
      />
    </Stack>
  );
}

function BatchDir(props: { title: string; files: BatchFile[]; wide: boolean; onDownload: (name: string) => void }) {
  return (
    <Stack gap={8}>
      <Text weight="semibold">{props.title}</Text>
      {props.files.length === 0 ? <Text size="small" tone="secondary">还没有成功文件。</Text> : null}
      {props.wide && props.files.length > 0 ? (
        <Table
          headers={["文件名", "时间", "行数", ""]}
          columnAlign={["left", "left", "right", "right"]}
          rows={props.files.map((file) => [
            file.name,
            file.at,
            String(file.rows),
            <Button key={file.id} variant="secondary" onClick={() => props.onDownload(file.name)}>下载</Button>,
          ])}
          striped
        />
      ) : null}
      {!props.wide ? props.files.map((file) => (
        <RecordCard key={file.id} name={file.name} date={file.at} action={<Button variant="secondary" onClick={() => props.onDownload(file.name)}>下载</Button>}>
          <Text size="small" tone="secondary">{file.rows} 行</Text>
        </RecordCard>
      )) : null}
    </Stack>
  );
}

function AdminFiles(props: { ctx: Ctx }) {
  const [imports] = useCanvasState<BatchFile[]>("import-files", IMPORT_FILE_SEED);
  const [voids] = useCanvasState<BatchFile[]>("void-files", VOID_FILE_SEED);
  const [note, setNote] = useState("");
  return (
    <Stack gap={12}>
      <Text size="small" tone="secondary">导入和作废分成两个目录。只保留整批成功的 Excel，失败的整批不保存。</Text>
      {note ? <Text size="small">{note}</Text> : null}
      <BatchDir title="导入成功" files={imports} wide={props.ctx.adminWide} onDownload={(name) => setNote(`已开始下载「${name}」。`)} />
      <BatchDir title="作废成功" files={voids} wide={props.ctx.adminWide} onDownload={(name) => setNote(`已开始下载「${name}」。`)} />
    </Stack>
  );
}

function AdminAdmins(props: { ctx: Ctx }) {
  const admins = [
    { name: "周宁", mask: "138****1001", phone: "13800001001" },
  ];
  const fields: QueryField[] = [
    { id: "phone", label: "手机号", kind: "key", placeholder: "手机号" },
    { id: "name", label: "姓名", kind: "name", placeholder: "姓名" },
  ];
  const [query, setQuery] = useState<Record<string, string>>(() => blankQuery(fields));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useCanvasState("page-size", 10);
  const name = queryText(query, "name");
  const phone = queryText(query, "phone");
  const list = admins.filter((admin) => {
    if (!hasText(admin.name, name)) return false;
    if (phone && !containsQuery(phone, [admin.phone, admin.mask])) return false;
    return true;
  });
  const rows = takePage(list, page, !props.ctx.adminWide, pageSize);
  return (
    <Stack gap={8}>
      <Callout tone="info">管理员没有状态。新增就是新录入一条记录。不再使用时直接删除这条记录。本页只读，没有新增、编辑、删除。</Callout>
      <QueryForm wide={props.ctx.adminWide} fields={fields} onApply={(next) => { setQuery(next); setPage(1); }} />
      {list.length === 0 ? <Text size="small" tone="secondary">没有符合条件的管理员。</Text> : null}
      {props.ctx.adminWide ? (
        <Table
          headers={["姓名", "手机号"]}
          rows={rows.map((admin) => [admin.name, <Reveal key={admin.phone} mask={admin.mask} full={admin.phone} />])}
          striped
        />
      ) : rows.map((admin) => (
        <RecordCard key={admin.phone} name={admin.name}>
          <Row gap={8} align="center">
            <Text size="small">手机号</Text>
            <Reveal mask={admin.mask} full={admin.phone} />
          </Row>
        </RecordCard>
      ))}
      <Pager page={page} total={list.length} onPage={setPage} pageSize={pageSize} onPageSize={setPageSize} infinite={!props.ctx.adminWide} />
      <Text size="small" tone="tertiary">记录删除后仍可使用用户登录，但「我的」不再出现「进入后台」。已经打开的管理端再请求时也会拒绝。至少保留一名管理员。</Text>
    </Stack>
  );
}

function CatalogButton(props: { label: string; section: string; active: boolean; onClick: () => void }) {
  const theme = useHostTheme();
  return (
    <button
      onClick={props.onClick}
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
        width: "100%",
        textAlign: "left",
        background: props.active ? theme.fill.tertiary : "transparent",
        color: props.active ? theme.text.primary : theme.text.secondary,
        border: "none",
        borderLeft: props.active ? `2px solid ${theme.accent.primary}` : "2px solid transparent",
        padding: "5px 8px",
        cursor: "pointer",
        fontSize: 12,
      }}
    >
      <span>{props.label}</span>
      <span style={{ color: theme.text.tertiary }}>{props.section}</span>
    </button>
  );
}

function Stage(props: { ctx: Ctx }) {
  const meta = pageMeta(props.ctx.screen);
  const admin = isAdminScreen(props.ctx.screen);
  const body = <ScreenBody ctx={props.ctx} />;
  return (
    <Stack gap={10} style={{ minWidth: 0, width: "100%", maxWidth: "100%" }}>
      <Row justify="space-between" align="end" wrap>
        <Stack gap={2}>
          <H2>{meta.label}</H2>
          <Text size="small" tone="tertiary">用例手册 {meta.section} · {admin ? (props.ctx.adminWide ? "管理端 · 桌面侧栏" : "管理端 · 移动 360px") : "用户端，宽度 360px"}</Text>
        </Stack>
        {admin ? (
          <Row gap={8}>
            <Pill active={props.ctx.adminWide} onClick={() => props.ctx.setAdminWide(true)}>桌面</Pill>
            <Pill active={!props.ctx.adminWide} onClick={() => props.ctx.setAdminWide(false)}>移动</Pill>
          </Row>
        ) : null}
      </Row>
      {admin ? (
        <AdminFrame screen={props.ctx.screen} ctx={props.ctx}>{body}</AdminFrame>
      ) : (
        <Phone
          stretch={props.ctx.screen === "u-login"}
          tab={tabOf(props.ctx.screen)}
          onTab={(tab) => {
            if (tab === "项目") props.ctx.open("u-projects");
            if (tab === "善款") props.ctx.open("u-gifts");
            if (tab === "我的") props.ctx.open(props.ctx.persona === "guest" ? "u-login" : "u-mine");
          }}
          dialog={props.ctx.pendingUnclaim ? <UnclaimDialog ctx={props.ctx} /> : null}
        >
          {body}
        </Phone>
      )}
    </Stack>
  );
}

function ScreenBody(props: { ctx: Ctx }) {
  const ctx = props.ctx;
  switch (ctx.screen) {
    case "u-projects":
      return <UserProjects ctx={ctx} />;
    case "u-project":
      return <UserProject key={ctx.projectId} ctx={ctx} />;
    case "u-gifts":
      return <UserGifts ctx={ctx} />;
    case "u-login":
      return <UserLogin ctx={ctx} />;
    case "u-reset":
      return <UserReset ctx={ctx} />;
    case "u-mine":
      return <UserMine ctx={ctx} />;
    case "u-records":
      return <UserRecords ctx={ctx} />;
    case "u-edit":
      return <UserEdit key={ctx.donationId} ctx={ctx} />;
    case "u-benefit":
      return <UserMine ctx={ctx} />;
    case "a-gifts":
      return <AdminGifts ctx={ctx} />;
    case "a-entry":
      return <AdminEntry ctx={ctx} />;
    case "a-import":
      return <AdminImport ctx={ctx} />;
    case "a-correct":
      return <AdminCorrect ctx={ctx} />;
    case "a-void":
      return <AdminVoid ctx={ctx} />;
    case "a-void-batch":
      return <AdminVoidBatch ctx={ctx} />;
    case "a-identities":
      return <AdminIdentities ctx={ctx} />;
    case "a-identity-new":
      return <AdminIdentityNew ctx={ctx} />;
    case "a-identity":
      return <AdminIdentity key={ctx.identityId} ctx={ctx} />;
    case "a-identity-edit":
      return <AdminIdentityEdit key={ctx.identityId} ctx={ctx} />;
    case "a-pick-gift":
      return <AdminPickGift ctx={ctx} />;
    case "a-projects":
      return <AdminProjects ctx={ctx} />;
    case "a-project-new":
      return <AdminProjectNew ctx={ctx} />;
    case "a-project":
      return <AdminProject key={ctx.projectId} ctx={ctx} />;
    case "a-project-edit":
      return <AdminProjectEdit ctx={ctx} />;
    case "a-add-person":
      return <AdminAddPerson ctx={ctx} />;
    case "a-expense":
      return <AdminExpense key="new" ctx={ctx} />;
    case "a-expense-edit":
      return <AdminExpense key="edit" ctx={ctx} mode="edit" />;
    case "a-progress":
      return <AdminProgress key="new" ctx={ctx} />;
    case "a-progress-edit":
      return <AdminProgress key="edit" ctx={ctx} mode="edit" />;
    case "a-people":
      return <AdminPeople ctx={ctx} />;
    case "a-person-new":
      return <AdminPersonNew ctx={ctx} />;
    case "a-person":
      return <AdminPerson ctx={ctx} />;
    case "a-files":
      return <AdminFiles ctx={ctx} />;
    case "a-voided":
      return <AdminVoided ctx={ctx} />;
    case "a-admins":
      return <AdminAdmins ctx={ctx} />;
    default:
      return <UserProjects ctx={ctx} />;
  }
}

export default function GlimmerPrototype() {
  const [screen, setScreen] = useCanvasState<ScreenId>("screen", "u-projects");
  const [persona, setPersona] = useCanvasState<Persona>("persona", "guest");
  const [projectId, setProjectId] = useCanvasState("project", "xm1");
  const [donationId, setDonationId] = useCanvasState("donation", "sk2");
  const [identityId, setIdentityId] = useCanvasState("identity", "微信支付|oAbc123");
  const [personId, setPersonId] = useCanvasState("person", "p1");
  const [notice, setNotice] = useState("");
  const [returnTo, setReturnTo] = useState<ScreenId>("u-projects");
  const [giftFilter, setGiftFilter] = useState<GiftFilter>("全部");
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("全部");
  const [alsoWechat, setAlsoWechat] = useState(false);
  const [releasedAlipay, setReleasedAlipay] = useState(false);
  const [beneficiaryOn, setBeneficiaryOn] = useState(true);
  const [bindPlatform, setBindPlatform] = useState("微信支付");
  const [bindPid, setBindPid] = useState("oAbc123");
  const [lockPerson, setLockPerson] = useState(false);
  const [pendingUnclaim, setPendingUnclaim] = useState("");
  const [goneExpenses, setGoneExpenses] = useCanvasState<string[]>("gone-expenses", []);
  const [identityEdits, setIdentityEdits] = useCanvasState<Record<string, { anon: boolean; display: string; bio: string }>>("identity-edits", {});
  const [passwordHints, setPasswordHints] = useState<Record<string, string>>({
    "13900000000": "李明",
    "13800001001": "周宁",
  });
  const [voided, setVoided] = useCanvasState<Voided[]>("voided-gifts", VOIDED_SEED);
  const goneGifts = voided.map((item) => item.id);
  const [adminWide, setAdminWide] = useCanvasState("admin-wide", true);
  const [giftBack, setGiftBack] = useState<ScreenId>("a-gifts");

  useEffect(() => {
    if (screen === "u-benefit" || (screen as string) === "u-bind" || (screen as string) === "u-bind-ok") setScreen("u-mine");
    if ((screen as string) === "a-home") setScreen("a-projects");
    if ((screen as string) === "a-gift" || (screen as string) === "a-pick-project") setScreen("a-gifts");
  }, [screen]);

  const open = (id: ScreenId, nextNotice?: string) => {
    setNotice(nextNotice ?? "");
    setPendingUnclaim("");
    setScreen(id);
  };
  const ctx: Ctx = {
    persona,
    setPersona,
    screen,
    open,
    notice,
    projectId,
    showUserProject: (id, ret) => {
      setProjectId(id);
      setReturnTo(ret);
      open("u-project");
    },
    showAdminProject: (id) => {
      setProjectId(id);
      open("a-project");
    },
    returnTo,
    giftBack,
    donationId,
    showGift: (id) => {
      setDonationId(id);
    },
    openGift: (id, next) => {
      setDonationId(id);
      setGiftBack(screen);
      open(next);
    },
    identityId,
    showIdentity: (id) => {
      setIdentityId(id);
      open("a-identity");
    },
    personId,
    showPerson: (id) => {
      setPersonId(id);
      open("a-person");
    },
    giftFilter,
    setGiftFilter,
    projectFilter,
    setProjectFilter,
    alsoWechat,
    setAlsoWechat,
    releasedAlipay,
    setReleasedAlipay,
    beneficiaryOn,
    setBeneficiaryOn,
    bindPlatform,
    setBindPlatform,
    bindPid,
    setBindPid,
    lockPerson,
    setLockPerson,
    pendingUnclaim,
    setPendingUnclaim,
    goneExpenses,
    dropExpense: (no) => setGoneExpenses((prev) => (prev.includes(no) ? prev : [...prev, no])),
    identityEdits,
    saveIdentityEdit: (id, anon, display, bio) => setIdentityEdits((prev) => ({ ...prev, [id]: { anon, display, bio } })),
    goneGifts,
    voided,
    dropGift: (id, reason, at) => setVoided((prev) => (prev.some((item) => item.id === id) ? prev : [{ id, at: voidStamp(at), reason: reason.trim() }, ...prev])),
    passwordHints,
    setPasswordHint: (phone, hint) => setPasswordHints((prev) => ({ ...prev, [phone]: hint })),
    adminWide,
    setAdminWide,
  };

  return (
    <Stack gap={16} style={{ minWidth: 0, maxWidth: "100%", overflowX: "hidden" }}>
      <style>{`
        .glimmer-fit, .glimmer-fit * { box-sizing: border-box; }
        .glimmer-fit table { width: 100%; max-width: 100%; table-layout: fixed; }
        .glimmer-fit th, .glimmer-fit td {
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .glimmer-fit input, .glimmer-fit textarea, .glimmer-fit select { max-width: 100%; }
      `}</style>
      <Stack gap={6}>
        <H1>微光原型</H1>
        <Text tone="secondary">
          按《产品需求文档》和《用户用例手册》V1.0 画出的可点击原型。左侧是页面目录，右侧是对应画面。金额和名单来自手册第 6 章的示例，不会写入真实数据。
        </Text>
        <Text size="small" tone="tertiary">
          访客不登录。登录用户 139****0000 已认领支付宝「张先生」，并绑定受益人李明。管理员周宁 138****1001 已录入，从「我的」的「进入后台」进入项目列表。
        </Text>
      </Stack>
      <Row gap={8} align="center" wrap>
        <Text size="small" tone="secondary">当前身份</Text>
        <Pill active={persona === "guest"} onClick={() => setPersona("guest")}>未登录访客</Pill>
        <Pill active={persona === "member"} onClick={() => setPersona("member")}>登录用户</Pill>
        <Pill active={persona === "admin"} onClick={() => setPersona("admin")}>管理员</Pill>
      </Row>
      <Grid columns="minmax(0, 220px) minmax(0, 1fr)" gap={20} align="start">
        <Stack gap={8} style={{ minWidth: 0 }}>
          <Text size="small" weight="semibold" tone="tertiary">用户端</Text>
          {USER_PAGES.map((page) => (
            <CatalogButton key={page.id} label={page.label} section={page.section} active={screen === page.id} onClick={() => open(page.id)} />
          ))}
          <Text size="small" weight="semibold" tone="tertiary">管理端</Text>
          {ADMIN_PAGES.map((page) => (
            <CatalogButton key={page.id} label={page.label} section={page.section} active={screen === page.id} onClick={() => open(page.id)} />
          ))}
        </Stack>
        <Stage ctx={ctx} />
      </Grid>
    </Stack>
  );
}
