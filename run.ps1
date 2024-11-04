# 启动后端
Write-Output "正在启动后端..."
Set-Location -Path "./Sever/"
if ($?) {
    $backend = Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev" -PassThru
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
    $frontend = Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev" -PassThru
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

# 捕获退出事件并停止所有进程
trap {
    Write-Output "关闭所有进程..."
    Stop-Process -Id $backend.Id
    Stop-Process -Id $frontend.Id
    exit 0
}
