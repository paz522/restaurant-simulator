"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Analytics } from "@vercel/analytics/react"
import { motion } from "framer-motion"

// 飲食店テンプレートのデータ
const restaurantTemplates = [
  { id: "cafe", name: "カフェ", cost: 500 },
  { id: "ramen", name: "ラーメン店", cost: 800 },
  { id: "izakaya", name: "居酒屋", cost: 1200 },
  { id: "teishoku", name: "定食屋", cost: 600 },
  { id: "curry", name: "カレー専門店", cost: 450 },
  { id: "takoyaki", name: "たこ焼き店", cost: 300 },
  { id: "kitchen_car", name: "キッチンカー", cost: 250 },
  { id: "delivery", name: "デリバリー専門店", cost: 200 },
]

export default function RestaurantSimulator() {
  const [template, setTemplate] = useState("")
  const [funding, setFunding] = useState<number>(1000)
  const [projectedSales, setProjectedSales] = useState<number>(500)
  const [monthlyCustomers, setMonthlyCustomers] = useState<number>(100)
  const [averagePrice, setAveragePrice] = useState<number>(2000)
  const [score, setScore] = useState<number | null>(null)
  const [isCalculated, setIsCalculated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 選択されたテンプレートのコストを取得
  const getTemplateCost = () => {
    const selectedTemplate = restaurantTemplates.find((t) => t.id === template)
    return selectedTemplate ? selectedTemplate.cost : 0
  }

  // 成功スコアを計算
  const calculateScore = () => {
    const cost = getTemplateCost()
    if (cost === 0) return 0

    // 月間の予想総売上を計算（来客数 × 平均単価）
    const estimatedMonthlyRevenue = (monthlyCustomers * averagePrice) / 10000; // 万円単位に変換

    // 収益性の評価（予想売上と初期コストの比率）- より厳しい評価
    const profitabilityRatio = estimatedMonthlyRevenue / cost;
    const profitabilityScore = Math.min(40, profitabilityRatio * 15); // 最大40点、係数を下げて厳しく

    // 資金の十分さの評価（初期資金と初期コストの比率）- より厳しい評価
    const fundingRatio = funding / cost;
    const fundingScore = Math.min(40, fundingRatio * 10); // 最大40点、係数を下げて厳しく

    // 現実的な経営難易度の減点（最大-20点）
    const difficultyPenalty = Math.min(20, 20 - (monthlyCustomers / 1000)); // 来客数が少ないほど厳しい

    // 総合スコアの計算（収益性と資金の十分さを合算し、難易度で減点）
    let calculatedScore = profitabilityScore + fundingScore - difficultyPenalty;

    // デバッグ用のログ出力
    console.log({
      template,
      cost,
      estimatedMonthlyRevenue,
      profitabilityRatio,
      profitabilityScore,
      fundingRatio,
      fundingScore,
      difficultyPenalty,
      calculatedScore
    });

    // スコアを0.5-100の範囲に制限（最低値を0.5に設定）
    calculatedScore = Math.min(100, Math.max(0.5, calculatedScore));

    return Math.round(calculatedScore * 10) / 10; // 小数点第一位まで保持
  }

  // シミュレーション実行
  const runSimulation = () => {
    // 店舗タイプが選択されていない場合はアラートを表示
    if (!template) {
      alert("店舗タイプを選択してください");
      return;
    }
    
    const calculatedScore = calculateScore()
    setScore(calculatedScore)
    setIsCalculated(true)
  }

  // スコアに基づくコメントを取得
  const getScoreComment = () => {
    if (score === null) return ""

    if (score >= 80) {
      return "一見良好な数字に見えますが、これは幻想です。飲食業界の現実は残酷で、初年度の売上は予想の半分以下になることがほとんどです。人件費の高騰、食材ロス、突発的な設備故障、競合店の出現など、想定外の問題が次々と襲いかかります。統計的には「良好」に見えるこの数字でさえ、実際には65%の確率で2年以内に閉店に追い込まれるでしょう。あなたの貴重な資金と時間を、より安定したビジネスに投資することを強く推奨します。飲食店の夢は、副業や趣味として小規模に始めるのが賢明です。"
    } else if (score >= 60) {
      return "この数字は危険な罠です。飲食店の85%は3年以内に閉店し、多くのオーナーは借金を抱えて人生を台無しにしています。開業初期の想定外の出費、スタッフの採用難、季節変動による売上の波、そして休みなく続く肉体的・精神的疲労を甘く見ていませんか？多くの経営者は睡眠時間を削り、家族との時間も犠牲にしても、わずかな利益さえ出せずに廃業します。この業界では「まあまあの見通し」は「確実な失敗」と同義です。あなたの人生と資金を賭けるには、あまりにもリスクが高すぎます。"
    } else if (score >= 40) {
      return "この計画は自滅への道です。資金ショートのリスクは極めて高く、個人経営では持ちこたえられないでしょう。飲食業界の現実は想像を絶するほど過酷で、毎日15時間以上の労働、休日なしの連続勤務、クレーム対応、人材確保の困難さなど、終わりのない問題との闘いが続きます。多くのオーナーは健康を害し、うつ病や不眠症に苦しみ、家族関係も崩壊します。この数字が示す警告を真剣に受け止め、飲食店開業という選択を今すぐ見直すべきです。あなたの才能は、より将来性のある分野で活かせるはずです。"
    } else if (score > 1) {
      return "この計画での開業は経済的自殺行為です。飲食業界は想像を絶する厳しさで、この数字では初期投資の回収すら不可能でしょう。毎日の仕入れ、在庫管理、シフト調整、衛生管理、設備メンテナンス、マーケティングなど、すべてを一人でこなしながら、お客様に笑顔で接し続けることは不可能です。多くのオーナーは精神的・肉体的に追い詰められ、最悪の場合、家族や友人を巻き込んだ借金地獄に陥ります。この結果は「絶対に開業してはいけない」という明確な警告です。今すぐこの計画を破棄し、別の道を模索してください。"
    } else {
      return "この計画は完全な破滅への道です。あなたの情熱は評価できますが、この数字が示す現実は残酷なほど明確です。飲食店経営は資金力、経験、人脈、体力、精神力のすべてが試される過酷な戦場であり、ほとんどの人は耐えられません。多くのオーナーは睡眠障害、慢性疲労、うつ病に苦しみ、最悪の選択をする例も少なくありません。あなたの人生を賭けるには、あまりにもリスクが高すぎます。まずは飲食業界で雇われる側として経験を積むか、完全に異なる業種でのキャリアを検討すべきです。ネットビジネスやデジタルコンテンツ制作など、初期投資が少なく、失敗のリスクが低い分野を強くお勧めします。"
    }
  }

  // スコアに基づいてテキストの色を取得
  const getScoreTextColor = () => {
    if (score === null) return ""

    if (score >= 80) {
      return "text-green-500"
    } else if (score >= 60) {
      return "text-green-400"
    } else if (score >= 40) {
      return "text-yellow-400"
    } else {
      return "text-red-400"
    }
  }

  // スコアに基づいてプログレスバーの色を取得
  const getProgressColor = () => {
    if (score === null) return ""

    if (score >= 80) {
      return "bg-green-500"
    } else if (score >= 60) {
      return "bg-green-400"
    } else if (score >= 40) {
      return "bg-yellow-400"
    } else {
      return "bg-red-400"
    }
  }

  // 月間予想売上を計算（表示用）
  const calculateMonthlyRevenue = () => {
    return ((monthlyCustomers * averagePrice) / 10000).toFixed(1); // 万円単位で小数点第1位まで
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-gray-200 py-10 px-4">
      <Analytics />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-600">
          飲食店開業をあきらめさせるシミュレーター
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-700/50 bg-gray-800/90">
                <CardTitle className="text-gray-100 text-xl">シミュレーション設定</CardTitle>
                <CardDescription className="text-gray-400">店舗タイプと初期条件を設定してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="template" className="text-gray-300 font-medium">店舗タイプ</Label>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger id="template" className="bg-gray-700/80 border-gray-600/50 text-gray-200 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all duration-200">
                      <SelectValue placeholder="店舗タイプを選択" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                      {restaurantTemplates.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="focus:bg-purple-900/30">
                          {t.name} (コスト: {t.cost}万円)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funding" className="text-gray-300 font-medium">初期資金 (万円)</Label>
                  <Input
                    id="funding"
                    type="number"
                    min="0"
                    value={funding}
                    onChange={(e) => setFunding(Number(e.target.value))}
                    className="bg-gray-700/80 border-gray-600/50 text-gray-200 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customers" className="text-gray-300 font-medium">月間来客数 (人)</Label>
                  <Input
                    id="customers"
                    type="number"
                    min="0"
                    max="10000"
                    value={monthlyCustomers}
                    onChange={(e) => setMonthlyCustomers(Number(e.target.value))}
                    className="bg-gray-700/80 border-gray-600/50 text-gray-200 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averagePrice" className="text-gray-300 font-medium">平均単価 (円)</Label>
                  <Input
                    id="averagePrice"
                    type="number"
                    min="0"
                    max="100000"
                    value={averagePrice}
                    onChange={(e) => setAveragePrice(Number(e.target.value))}
                    className="bg-gray-700/80 border-gray-600/50 text-gray-200 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all duration-200"
                  />
                </div>

                <div className="mt-2 p-4 bg-gray-700/50 backdrop-blur-sm rounded-lg border border-gray-600/30 shadow-inner">
                  <p className="text-sm font-medium text-gray-200">予想月間売上: <span className="text-pink-400">{calculateMonthlyRevenue()}万円</span></p>
                  <p className="text-xs text-gray-400 mt-1">（来客数 × 平均単価から自動計算）</p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-700/50 pt-6 bg-gray-800/50">
                <Button 
                  onClick={runSimulation} 
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium py-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-pink-700/20"
                >
                  シミュレーション実行
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="border-b border-gray-700/50 bg-gray-800/90">
                <CardTitle className="text-gray-100 text-xl">シミュレーション結果</CardTitle>
                <CardDescription className="text-gray-400">成功スコアと分析結果</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {isCalculated ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-gray-300 font-medium">成功スコア: {score}/100</Label>
                        <span className={`font-bold ${getScoreTextColor()}`}>{score}%</span>
                      </div>
                      <Progress 
                        value={score || 0} 
                        className="h-3 bg-gray-700/50 rounded-full"
                        indicatorClassName={`${getProgressColor()} rounded-full transition-all duration-1000 ease-in-out`}
                      />
                    </div>

                    <div className="p-5 rounded-xl bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 shadow-inner">
                      <h3 className="font-medium mb-3 text-gray-200">分析結果:</h3>
                      <p className={`${getScoreTextColor()} text-sm leading-relaxed`}>{getScoreComment()}</p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-200">詳細情報:</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-300">
                        <li>選択した店舗: <span className="text-pink-400">{restaurantTemplates.find((t) => t.id === template)?.name}</span></li>
                        <li>初期コスト: <span className="text-pink-400">{getTemplateCost()}万円</span></li>
                        <li>初期資金: <span className="text-pink-400">{funding}万円</span></li>
                        <li>月間来客数: <span className="text-pink-400">{monthlyCustomers}人</span></li>
                        <li>平均単価: <span className="text-pink-400">{averagePrice}円</span></li>
                        <li>予想月間売上: <span className="text-pink-400">{calculateMonthlyRevenue()}万円</span></li>
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-400">シミュレーションを実行してください</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="border-b border-gray-700/50 bg-gray-800/90">
              <CardTitle className="text-gray-100 text-xl">飲食店経営の現実</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                <div className="p-5 rounded-xl bg-gray-700/30 backdrop-blur-sm border border-gray-600/30">
                  <h3 className="text-lg font-medium mb-3 text-red-400">飲食業界の厳しい現実</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>新規開業した飲食店の約70%が1年以内に閉店</li>
                    <li>5年後の生存率はわずか10%程度という統計も</li>
                    <li>個人経営の場合、病気や怪我で一時的に働けなくなると即経営危機</li>
                    <li>開業資金の回収に平均3〜5年かかるとされる</li>
                    <li className="text-red-400 font-medium">フランチャイズは絶対にやめておけ！本部に搾取され続け、ロイヤリティと強制仕入れで利益が出ず人生終わる</li>
                    <li className="text-red-400 font-medium">友人との共同経営は必ず揉めて終わる！お金の問題で友情も破壊され、最悪の場合訴訟沙汰に発展することも</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-gray-700/30 backdrop-blur-sm border border-gray-600/30">
                  <h3 className="text-lg font-medium mb-3 text-gray-200">想定外のコスト</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>人件費は予想より20〜30%高くなることが多い</li>
                    <li>食材ロスは売上の10〜15%に達することも</li>
                    <li>設備の故障や修繕費用は年間で初期投資の5〜10%</li>
                    <li>広告宣伝費は継続的に売上の5〜10%必要</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-gray-700/30 backdrop-blur-sm border border-gray-600/30">
                  <h3 className="text-lg font-medium mb-3 text-gray-200">代替案の検討</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>店舗を持たないビジネスを検討（ネットショップ、デジタルコンテンツの販売、動画編集、オンライン教育など）</li>
                    <li>まずは副業として小規模に始め、実績を作ってから本格展開</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

