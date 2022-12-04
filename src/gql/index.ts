import {gql} from "@apollo/client";


export const WITHDRAWAL_APPROVAL = gql`
    mutation withdrawalApproval($amount: Int!,$transactionHash:String, $failureReasons: String, $id: Int!, $status: Int!){
        withdrawalApproval(amount:$amount,failureReasons:$failureReasons,id:$id,status:$status,transactionHash:$transactionHash){
            code,
            message
        }

    }
`;


export const WITHDRAWAL_LIST = gql`
    query withdrawalList($status: Int!){
        withdrawalList(status:$status){
            edges{
                node{
                    transactionHash,
                    amount,
                    specialAmount,
                    failureReasons,
                    id,
                    status,
                    type,
                    createdAt,
                    updatedAt,
                    account,
                    user{
                        account,
                        walletAddress,
                        accountFrozen,
                        withdrawalAmount,
                        balance,
                        createdAt,
                        email,
                        gold,
                        id,
                        inviterCode,
                        inviterId,
                        isAdmin,
                        updatedAt,
                    }
                }
            },
            totalCount
        }
    }
`


export const RECHARGE_APPROVAL = gql`
    mutation rechargeApproval($amount: Int!, $failureReasons: String, $id: Int!, $status: Int!){
        rechargeApproval(amount:$amount,failureReasons:$failureReasons,id:$id,status:$status){
            code,
            message
        }

    }
`;


export const RECHARGE_LIST = gql`
    query rechargeList($status: Int!){
        rechargeList(status:$status){
            edges{
                node{
                    transactionHash,
                    amount,
                    specialAmount,
                    failureReasons,
                    id,
                    status,
                    type,
                    createdAt,
                    updatedAt,
                    user{
                        account,
                        accountFrozen,
                        balance,
                        walletAddress,
                        createdAt,
                        email,
                        gold,
                        id,
                        inviterCode,
                        inviterId,
                        isAdmin,
                        updatedAt,
                    }
                }
            },
            totalCount
        }
    }
`


export const ADD_VIDEO = gql`
    mutation addVideo($file: FileArgs!){
        addVideo(file:$file){
            code,
            message
        }
    }
`

export const DELETE_VIDEO = gql`
    mutation deleteVideo($id: Int!){
        deleteVideo(id:$id){
            code,
            message
        }
    }
`

export const UPDATE_VIDEO = gql`
    mutation updateVideo($id:Int!,$file: FileArgs!){
        updateVideo(id:$id,file: $file){
            code,
            message
        }
    }
`

export const VIDEO = gql`
    query video($id:Int!){
        video(id:$id){
            code,
            message,
            body{
                id,
                file{
                    id,
                    url,
                    size,
                    md5FileName,
                    name,
                }
            }
        }
    }
`

export const VIDEO_LIST = gql`
    query videoList{
        videoList{
            code,
            message,
            body{
                id,
                file{
                    id,
                    url,
                    size,
                    md5FileName,
                    name,
                }
            }
        }
    }
`


export const ZONE_LIST = gql`
    query zoneList{
        zoneList{
            code,
            body{
                id,
                title,
                cover{
                    id,
                    url,
                    size,
                    md5FileName,
                    name,
                },
                probability,
                unitPrice,
                shareProfit,
                takes,
                award,
                gold,
                introduce,
                createdAt,
                updatedAt,
            },
            message
        }
    }
`

export const ZONE = gql`
    query zone($id:Int!){
        zone(id:$id){
            code,
            body{
                id,
                title,
                cover{
                    id,
                    url,
                    size,
                    md5FileName,
                    name,
                },
                maxFreezesNum,
                probability,
                unitPrice,
                shareProfit,
                takes,
                award,
                gold,
                introduce,
                createdAt,
                updatedAt,
            },
            message
        }
    }
`

export const ADD_ZONE = gql`
    mutation addZone(
        $award: Float!
        $gold: Int!
        $cover: FileArgs!
        $introduce: String!
        $probability: Int!
        $shareProfit: Float!
        $takes: Int!
        $title: String!
        $unitPrice: Float!
        $maxFreezesNum: Int!
    ){
        addZone(
            award: $award
            gold: $gold
            cover: $cover
            introduce: $introduce
            probability: $probability
            shareProfit: $shareProfit
            takes: $takes
            title: $title
            unitPrice: $unitPrice
            maxFreezesNum:$maxFreezesNum
        ){
            code,
            message
        }
    }
`


export const UPDATE_ZONE = gql`
    mutation updateZone(
        $id: Int!
        $award: Float!
        $gold: Int!
        $cover: FileArgs!
        $introduce: String!
        $probability: Int!
        $shareProfit: Float!
        $takes: Int!
        $title: String!
        $unitPrice: Float!
        $maxFreezesNum: Int!
    ){
        updateZone(
            id: $id
            award: $award
            gold: $gold
            cover: $cover
            introduce: $introduce
            probability: $probability
            shareProfit: $shareProfit
            takes: $takes
            title: $title
            unitPrice: $unitPrice
            maxFreezesNum:$maxFreezesNum
        ){
            code,
            message
        }
    }
`


export const PAYMENTS = gql`
  query payments {
    payments {
      account
      icon
      id
      placeholder
      isRecharge
      isWithdrawal
      name
      tips
      type
    }
  }
`;
