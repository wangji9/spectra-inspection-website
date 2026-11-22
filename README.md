# 观澜 SPECTRA 产品网站

响应式、无构建依赖的产品介绍网站，源文件与部署内容均在 `dist/`。不包含交易、价格或后端业务接口。

本地预览：在本目录执行 `python -m http.server 4173 --directory dist`，访问 http://localhost:4173。

内容依据：现场巡检设备产品介绍 v1（用户提供 PPTX）；https://github.com/wangji9/FieldInspectionAssistant ，包括 README、巡检业务流程文档、NativeSignalPipeline.cpp。观澜 SPECTRA 品牌及 Terminal / Studio 功能分层是设计提案，不表示已有独立硬件或云产品。

视觉素材取自用户 PPT：overview.png（image8）、acoustic.png（image13）、workflow.png（image18）、voice.png（image22）、pump.jpg（image25，PPT 标注 AI 生成）、electrical.jpg（image6，PPT 标注公开实拍）、handover.jpg（image35，PPT 标注 AI 生成）。发布前应由素材持有人确认公开实拍的使用权。

频谱演示：固定随机种子的合成信号，16 kHz 采样，4096 点。FFT 使用周期 Hann 窗，Welch 使用 1024 点分段与 50% 重叠；图形为真实计算结果，不作为产品测试数据。三次时间对齐数据 40/235/40 ms 来源 PPT，对应特定板端样本。

交互：移动导航、产品导览、能力详情模态框、分析模式、图表指针、平台与场景页签。页签支持方向键/Home/End，图表支持方向键和 Escape，弹窗支持 Escape 和焦点恢复，支持减少动态效果的系统偏好。

## 第二版
移除页面来源及设计说明小字；保留全部原有章节，新增视觉与语音智能章节、六类场景、技术规格、五步顺序动画与完整图片查看器。README 内容已与 origin/main 的根目录及应用目录 README 核对，包含 16 kHz 六通道 PCM、多帧视频理解、实例分割、关键点识别、工程图谱、PDF 模板、报告版本和业务备份。新素材 production.jpg/image30、fan.jpg/image7、fixed.jpg/image1、event.png/image15、defect.png/image33、report.png/image21、thermal.png/image9、vision.png/image10 均来自原始 PPT。


## 第三版
新增独立红外热成像、板端大模型与语音章节；时间对齐章节增加原始采样表和匹配过程。加入模态导航，统一章节间距、标题语义行、正文自然换行和窄屏布局。新增 thermal-detail.png/image14 与 model-qa.png/image16，来源为用户原始 PPT。

