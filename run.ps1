# 启动后端
Write-Output "正在启动后端..."
Set-Location -Path "./Sever/"
if ($?) {
    Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev"
    if (-not $?) {
        Write-Output "后端启动失败"
        exit 1
    }
} else {
    Write-Output "无法进入 ./Sever/ 目录"
    exit 1
}
Set-Location -Path "../"

# 启动前端
Write-Output "正在启动前端..."
Set-Location -Path "./Web/"
if ($?) {
    Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev"
    if (-not $?) {
        Write-Output "前端启动失败"
        exit 1
    }
} else {
    Write-Output "无法进入 ./Web/ 目录"
    exit 1
}
Set-Location -Path "../"
Write-Output "脚本执行完毕！"
exit 0
