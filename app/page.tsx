"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Analytics } from "@vercel/analytics/react"

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

    // スコアを0.5-100の範囲に制限（最低値を0.5に設定）
    calculatedScore = Math.min(100, Math.max(0.5, calculatedScore));

    return Math.round(calculatedScore * 10) / 10; // 小数点第一位まで保持
  }

  // シミュレーション実行
  const runSimulation = () => {
    const calculatedScore = calculateScore()
    setScore(calculatedScore)
    setIsCalculated(true)
  }

  // スコアに基づくコメントを取得
  const getScoreComment = () => {
    if (score === null) return ""

    if (score >= 80) {
      return "見通しは良好に見えますが、これは机上の計算に過ぎません。現実の飲食業界では、初年度は予想の半分程度の売上になることがほとんどです。人件費や食材ロス、突発的な設備故障など、想定外のコストが次々と発生します。また、競合店の出現や消費者の嗜好変化、食材価格の高騰など、外部環境の変化にも常に脅かされます。統計的には「良好」に見えるこの数字でさえ、実際には7割の確率で3年以内に閉店に追い込まれるでしょう。本当にそのリスクを取る価値がありますか？あなたの貴重な資金と時間を、もっと成功確率の高いビジネスに投資することを強くお勧めします。"
    } else if (score >= 60) {
      return "一見悪くない数字に見えますが、飲食店の90%は5年以内に閉店するという厳しい現実を直視してください。この業界では「まあまあの見通し」は実質的に「失敗の前触れ」と同義です。開業初期の想定外の出費、スタッフの採用・教育コスト、季節変動による売上の波、そして何より休むことなく続く肉体的・精神的疲労を考慮していますか？多くの経営者は睡眠時間を削り、休日返上で働き続けても、わずかな利益さえ出せずに借金だけが残ります。あなたの人生の貴重な数年間と資金を失うリスクを冒す前に、もう一度冷静に考え直してください。"
    } else if (score >= 40) {
      return "非常に厳しい見通しです。この計画では資金ショートのリスクが極めて高く、個人経営では持ちこたえられない可能性が高いでしょう。飲食業界の現実は、あなたが想像している以上に過酷です。毎日12〜16時間の労働、休日なしの連続勤務、突発的なトラブル対応、クレーム処理、人材確保の困難さ...。これらすべてに対応しながら、利益を出し続けなければなりません。多くの経営者は健康を害し、家族関係が崩壊し、最終的には借金を抱えて廃業します。この数字が示す警告を真剣に受け止め、飲食店開業という選択を今すぐ見直すべきです。あなたの才能と資金は、もっと将来性のある分野で活かせるはずです。"
    } else if (score > 1) {
      return "この計画での開業は自殺行為に等しいと言わざるを得ません。飲食業は想像を絶する厳しい業界で、この数字では初期投資の回収すら絶望的です。毎日の仕入れ、在庫管理、スタッフのシフト調整、衛生管理、設備メンテナンス、マーケティング...。これらすべてを一人でこなしながら、お客様に笑顔で接し続けるというのは、ほぼ不可能な挑戦です。多くの経営者は精神的・肉体的に追い詰められ、うつ病や身体疾患を発症します。最悪の場合、家族や友人を巻き込んだ借金地獄に陥り、人間関係まで破壊されることも珍しくありません。この結果は、あなたに「絶対に開業してはいけない」と警告しています。今すぐこの計画を破棄し、別の道を模索することを強く勧めます。"
    } else {
      return "この計画での開業は絶対に避けるべきです。あなたの情熱は評価できますが、この数字が示す現実は残酷なほど明確です。飲食店経営は、資金力、経験、人脈、体力、精神力のすべてが試される過酷な戦場です。多くの経営者は睡眠障害、慢性疲労、うつ病に苦しみ、家庭崩壊や借金苦から最悪の選択をする例も少なくありません。あなたの人生を賭けるには、あまりにもリスクが高すぎます。今はまず、飲食業界で雇われる側として経験を積むか、完全に異なる業種でのキャリアを検討すべきです。ネットビジネスやデジタルコンテンツ制作など、初期投資が少なく、失敗のリスクが低い分野で才能を活かしてください。飲食店への夢は、趣味や副業レベルで満足させるのが賢明です。"
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

  return (
    <div className="container mx-auto py-10 px-4 bg-gray-900 text-gray-200 min-h-screen">
      <Analytics />
      <h1 className="text-3xl font-bold text-center mb-8 text-red-400">飲食店開業をあきらめさせるシミュレーター</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-gray-100">シミュレーション設定</CardTitle>
            <CardDescription className="text-gray-400">店舗タイプと初期条件を設定してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="template" className="text-gray-300">店舗タイプ</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger id="template" className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="店舗タイプを選択" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  {restaurantTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="focus:bg-gray-600">
                      {t.name} (コスト: {t.cost}万円)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="funding" className="text-gray-300">初期資金 (万円)</Label>
              <Input
                id="funding"
                type="number"
                min="0"
                value={funding}
                onChange={(e) => setFunding(Number(e.target.value))}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customers" className="text-gray-300">月間来客数 (人)</Label>
              <Input
                id="customers"
                type="number"
                min="0"
                max="10000"
                value={monthlyCustomers}
                onChange={(e) => setMonthlyCustomers(Number(e.target.value))}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="averagePrice" className="text-gray-300">平均単価 (円)</Label>
              <Input
                id="averagePrice"
                type="number"
                min="0"
                max="100000"
                value={averagePrice}
                onChange={(e) => setAveragePrice(Number(e.target.value))}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            <div className="mt-2 p-3 bg-gray-700 rounded-md">
              <p className="text-sm font-medium text-gray-300">予想月間売上: {calculateMonthlyRevenue()}万円</p>
              <p className="text-xs text-gray-400 mt-1">（来客数 × 平均単価から自動計算）</p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-700 pt-6">
            <Button onClick={runSimulation} className="w-full bg-red-900 hover:bg-red-800 text-white">
              シミュレーション実行
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-gray-100">シミュレーション結果</CardTitle>
            <CardDescription className="text-gray-400">成功スコアと分析結果</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {isCalculated ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-gray-300">成功スコア: {score}/100</Label>
                    <span className={`font-medium ${getScoreTextColor()}`}>{score}%</span>
                  </div>
                  <Progress 
                    value={score || 0} 
                    className="h-2 bg-gray-700"
                    indicatorClassName={getProgressColor()}
                  />
                </div>

                <div className="p-4 rounded-lg bg-gray-700">
                  <h3 className="font-medium mb-2 text-gray-300">分析結果:</h3>
                  <p className={getScoreTextColor()}>{getScoreComment()}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-300">詳細情報:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>選択した店舗: {restaurantTemplates.find((t) => t.id === template)?.name}</li>
                    <li>初期コスト: {getTemplateCost()}万円</li>
                    <li>初期資金: {funding}万円</li>
                    <li>月間来客数: {monthlyCustomers}人</li>
                    <li>平均単価: {averagePrice}円</li>
                    <li>予想月間売上: {calculateMonthlyRevenue()}万円</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-400">シミュレーションを実行してください</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-gray-100">飲食店経営の現実</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-red-400">飲食業界の厳しい現実</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>新規開業した飲食店の約70%が1年以内に閉店</li>
                  <li>5年後の生存率はわずか10%程度という統計も</li>
                  <li>個人経営の場合、病気や怪我で一時的に働けなくなると即経営危機</li>
                  <li>開業資金の回収に平均3〜5年かかるとされる</li>
                  <li className="text-red-400 font-medium">フランチャイズは絶対にやめておけ！本部に搾取され続け、ロイヤリティと強制仕入れで利益が出ず人生終わる</li>
                  <li className="text-red-400 font-medium">友人との共同経営は必ず揉めて終わる！お金の問題で友情も破壊され、最悪の場合訴訟沙汰に発展することも</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-300">想定外のコスト</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>人件費は予想より20〜30%高くなることが多い</li>
                  <li>食材ロスは売上の10〜15%に達することも</li>
                  <li>設備の故障や修繕費用は年間で初期投資の5〜10%</li>
                  <li>広告宣伝費は継続的に売上の5〜10%必要</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-gray-300">代替案の検討</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>店舗を持たないビジネスを検討（ネットショップ、デジタルコンテンツの販売、動画編集、オンライン教育など）</li>
                  <li>まずは副業として小規模に始め、実績を作ってから本格展開</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

