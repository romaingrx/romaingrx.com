"use client"

import { motion } from "framer-motion"
import { Article } from "@/.contentlayer/generated"
import { MotionValue } from "framer-motion"

export function BlogPost({
    scrollYProgress,
    article,
    index,
}: {
    scrollYProgress : MotionValue<number>
    article : Article
    index : number
}){
    return (<motion.div>
        {article.title}
    </motion.div>)
}