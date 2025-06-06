"use client"
import Category from "../components/common/category-layout";
import SearchBar from "@/app/components/WordTip/search-bar-layout";
import Button from "@/app/components/common/button-layout";
import styles from "../(job-tips-words)/job-layout.module.css"
import { useState, useEffect } from "react";
import axios from "axios";
import TipWrite from "../components/WordTip/tip-write-layout";
import InfoCard from "@/app/components/WordTip/infoCard-layout";
import Header from "@/app/components/WordTip/header-layout";



export default function TipPage() {
    const [activeCategory, setActiveCategory] = useState<string>("전체")
    const [showWritePopup, setShowWritePopup] = useState(false)
    const [tips, setTips] = useState<any[]>([]) //단어 data 저장할 상태

    const categories = ["전체", "개발", "디자인"];
    const token = localStorage.getItem("token");

    const handleCategoryClick = async (category: string) => {
        setActiveCategory(category)

        try {
            const response = await axios.get(`http://localhost:5000/tips/${category}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setTips(response.data.tips)
        } catch (err) {
            console.error('api호출 오류 : ', err)
        }
    }

    useEffect(() => {
        handleCategoryClick('전체')
    }, [])


    //검색
    const [input, setInput] = useState("");
    const handleSearch = async (keyword: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/tips/search?keyword=${keyword}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setActiveCategory("")
            const searchData = response.data.tips
            setTips(searchData)
            console.log("검색한 데이터: ", searchData)
        } catch (err) {
            console.error('팁 검색 API 오류: ', err)
        }
    }

    useEffect(() => {
        const timmer = setTimeout(() => {
            const trimmed = input.trim()
            if (trimmed !== "") {
                handleSearch(trimmed)
            } else {
                handleCategoryClick("전체")
            }
        }, 300)
        return () => clearTimeout(timmer)
    }, [input])

    return (
        <div className={styles.allContainer}>
            <div className={styles.contentContainer}>
                <div className={styles.searchHeaderContainer}>
                    <Header />
                    <SearchBar
                        title={"단어"}
                        input={input}
                        setInput={setInput}
                    />
                </div>


                {/* 카테고리 / 단어 추가 btn */}
                <div className={styles.categoryContainer}>
                    <div className={styles.categoryList}>
                        {categories.map((category) => (
                            <Category
                                key={category}
                                type={category}
                                onClick={() => handleCategoryClick(category)}
                                isActive={category === activeCategory}
                            />
                        ))}
                    </div>

                    <span className={styles.addWordsBtn}
                        onClick={() => setShowWritePopup(true)}>
                        팁 추가 +
                    </span>
                </div>

                {/* 정보 카드들 */}
                <div className={styles.TipInfoCardContainer}>
                    {tips.length > 0 ? (
                        tips.map((tip) => (
                            <InfoCard
                                key={tip.id}
                                title={tip.tip}
                                detail={tip.explanation}
                                width="527px"
                                padding="43px 57px"
                                className="titleSpan"
                                marginRight="16px"
                                gap="0"
                                category={tip.category}
                                contentId={tip.id}
                            />
                        ))
                    ) : (
                        <div className={styles.noneDataFieldContainer}>
                            <p className={styles.noneMsg}>해당 카테고리에 해당하는 직무 팁이 없습니다.</p>
                        </div>
                    )}
                </div>

            </div>
            {/* 작성 팝업 */}
            <div style={{ zIndex: "1000" }}>
                {showWritePopup && (
                    <TipWrite
                        mainPlaceholder="단어를"
                        contentPlaceholder="단어의 뜻을"
                        buttonTitle="팁 게시하기"
                        closeOnClick={() => setShowWritePopup(false)}
                    />

                )}
            </div>

        </div >
    )
}